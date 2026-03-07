import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/*
GET ALL BOOKINGS
*/
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        b.id,
        c.first_name || ' ' || c.last_name AS customer,
        r.room_number,
        b.check_in_date,
        b.check_out_date,
        b.total_amount,
        b.booking_status
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      JOIN rooms r ON b.room_id = r.id
      ORDER BY b.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

/*
CREATE BOOKING
*/
router.post("/", async (req, res) => {
  try {
    const { customer_id, room_id, check_in_date, check_out_date } = req.body;

    /* 🔹 PREVENT PAST BOOKING */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkIn = new Date(check_in_date);
    checkIn.setHours(0, 0, 0, 0);

    const checkOut = new Date(check_out_date);
    checkOut.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return res.status(400).json({
        error: "Check-in date cannot be in the past"
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({
        error: "Check-out must be after check-in"
      });
    }

    /* CHECK ROOM EXISTS */
    const room = await pool.query(
      "SELECT * FROM rooms WHERE id=$1",
      [room_id]
    );

    if (room.rows.length === 0) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.rows[0].status === "maintenance") {
      return res.status(400).json({ error: "Room under maintenance" });
    }

    /* PREVENT DOUBLE BOOKING */
    const conflict = await pool.query(`
      SELECT * FROM bookings
      WHERE room_id = $1
      AND booking_status IN ('confirmed','completed')
      AND (
        check_in_date < $3
        AND check_out_date > $2
      )
    `, [room_id, check_in_date, check_out_date]);

    if (conflict.rows.length > 0) {
      return res.status(400).json({
        error: "This room is already booked for these dates"
      });
    }

    /* CALCULATE TOTAL PRICE */
    const price = room.rows[0].price_per_night;
    const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
    const total = nights * price;

    /* INSERT BOOKING */
    const result = await pool.query(`
      INSERT INTO bookings
      (customer_id, room_id, check_in_date, check_out_date, total_amount, booking_status)
      VALUES ($1,$2,$3,$4,$5,'confirmed')
      RETURNING *
    `,
      [customer_id, room_id, check_in_date, check_out_date, total]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Booking failed" });
  }
});

/*
CANCEL BOOKING
*/
router.put("/cancel/:id", async (req, res) => {
  try {
    const booking = await pool.query(
      "SELECT * FROM bookings WHERE id=$1",
      [req.params.id]
    );

    if (booking.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await pool.query(
      "UPDATE bookings SET booking_status='cancelled' WHERE id=$1",
      [req.params.id]
    );

    res.json({ message: "Booking cancelled" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cancel failed" });
  }
});

/*
CHECKOUT BOOKING (AUTO PAYMENT SAFE VERSION)
*/
router.put("/complete/:id", async (req, res) => {

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const bookingResult = await client.query(
      "SELECT * FROM bookings WHERE id=$1",
      [req.params.id]
    );

    if (bookingResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = bookingResult.rows[0];

    const existingPayment = await client.query(
      "SELECT * FROM payments WHERE booking_id=$1",
      [booking.id]
    );

    if (existingPayment.rows.length === 0) {
      await client.query(`
        INSERT INTO payments
        (booking_id, amount_paid, payment_method, payment_status, payment_date)
        VALUES ($1, $2, 'cash', 'completed', NOW())
      `,
        [booking.id, booking.total_amount]
      );
    }

    await client.query(
      "UPDATE bookings SET booking_status='completed' WHERE id=$1",
      [booking.id]
    );

    await client.query("COMMIT");

    res.json({ message: "Guest checked out & payment recorded" });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  } finally {
    client.release();
  }
});

export default router;