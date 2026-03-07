import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/*
GET ALL ROOMS WITH DYNAMIC OCCUPANCY
*/

router.get("/", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
        r.id,
        r.room_number,
        r.room_type,
        r.price_per_night,
        r.status,

        CASE
          WHEN r.status = 'maintenance' THEN 'maintenance'
          WHEN EXISTS (
            SELECT 1 FROM bookings b
            WHERE b.room_id = r.id
            AND b.booking_status = 'confirmed'
            AND CURRENT_DATE BETWEEN b.check_in_date 
                                 AND b.check_out_date - INTERVAL '1 day'
          )
          THEN 'occupied'
          ELSE 'available'
        END AS computed_status

      FROM rooms r
      ORDER BY r.room_number
    `);

    const rooms = result.rows.map(room => ({
      ...room,
      status: room.computed_status
    }));

    res.json(rooms);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});


/*
UPDATE ROOM STATUS (ONLY MAINTENANCE / AVAILABLE MANUAL)
*/

router.put("/status/:id", async (req, res) => {

  try {

    const { status } = req.body;

    if (!["available", "maintenance"].includes(status)) {
      return res.status(400).json({
        error: "Only available or maintenance can be set manually"
      });
    }

    const result = await pool.query(`
      UPDATE rooms
      SET status = $1
      WHERE id = $2
      RETURNING *
    `,
      [status, req.params.id]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);
    res.status(500).json({
      error: "Failed to update room status"
    });

  }

});

export default router;