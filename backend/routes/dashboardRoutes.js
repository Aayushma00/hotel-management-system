import express from "express";
import pool from "../config/db.js";
import axios from "axios";

const router = express.Router();

/* =======================================================
   DYNAMIC ROOM STATS (PROFESSIONAL HOTEL LOGIC)
   ======================================================= */
router.get("/room-stats", async (req, res) => {
  try {

    /* Total rooms */
    const totalRooms = await pool.query(`
      SELECT COUNT(*) FROM rooms
    `);

    /* Rooms under maintenance */
    const maintenance = await pool.query(`
      SELECT COUNT(*) FROM rooms WHERE status='maintenance'
    `);

    /* Occupied rooms (today >= check_in AND today < check_out) */
    const occupied = await pool.query(`
      SELECT COUNT(DISTINCT room_id)
      FROM bookings
      WHERE booking_status IN ('confirmed','completed')
      AND CURRENT_DATE >= check_in_date
      AND CURRENT_DATE < check_out_date
    `);

    const totalCount = Number(totalRooms.rows[0].count);
    const occupiedCount = Number(occupied.rows[0].count);
    const maintenanceCount = Number(maintenance.rows[0].count);

    /* Available rooms */
    const availableCount = totalCount - occupiedCount - maintenanceCount;

    const occupancyRate =
      totalCount > 0
        ? (occupiedCount / totalCount) * 100
        : 0;

    res.json({
      totalRooms: totalCount,
      available: availableCount,
      occupied: occupiedCount,
      maintenance: maintenanceCount,
      occupancyRate: occupancyRate.toFixed(2)
    });

  } catch (error) {
    console.error("Room stats error:", error);
    res.status(500).json({ error: error.message });
  }
});


/* =======================================================
   REAL REVENUE (FROM PAYMENTS TABLE)
   ======================================================= */
router.get("/revenue", async (req, res) => {
  try {

    /* Today's revenue */
    const todayRevenue = await pool.query(`
      SELECT COALESCE(SUM(amount_paid),0) AS revenue
      FROM payments
      WHERE DATE(payment_date) = CURRENT_DATE
      AND payment_status = 'completed'
    `);

    /* Monthly revenue */
    const monthlyRevenue = await pool.query(`
      SELECT COALESCE(SUM(amount_paid),0) AS revenue
      FROM payments
      WHERE DATE_TRUNC('month', payment_date)
            = DATE_TRUNC('month', CURRENT_DATE)
      AND payment_status = 'completed'
    `);

    /* Total revenue */
    const totalRevenue = await pool.query(`
      SELECT COALESCE(SUM(amount_paid),0) AS revenue
      FROM payments
      WHERE payment_status = 'completed'
    `);

    res.json({
      todayRevenue: todayRevenue.rows[0].revenue,
      monthlyRevenue: monthlyRevenue.rows[0].revenue,
      totalRevenue: totalRevenue.rows[0].revenue
    });

  } catch (error) {
    console.error("Revenue error:", error);
    res.status(500).json({ error: "Revenue calculation failed" });
  }
});


/* =======================================================
   PREDICTED REVENUE (AI FORECAST)
   ======================================================= */
router.get("/predicted-revenue", async (req, res) => {
  try {

    const forecast = await axios.get("http://127.0.0.1:8000/forecast");

    const avgPriceQuery = await pool.query(`
      SELECT AVG(price_per_night) AS avg_price FROM rooms
    `);

    const avgPrice = Number(avgPriceQuery.rows[0].avg_price);

    let predictedRevenue = 0;

    forecast.data.forEach(day => {
      predictedRevenue += Number(day.yhat) * avgPrice;
    });

    res.json({
      predictedRevenue: predictedRevenue.toFixed(2)
    });

  } catch (error) {
    console.error("Predicted revenue error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;