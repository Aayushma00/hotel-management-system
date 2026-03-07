import express from "express";
import axios from "axios";

const router = express.Router();

/* AI BOOKING FORECAST */
router.get("/", async (req, res) => {
  try {

    const response = await axios.get("http://127.0.0.1:8000/forecast");

    const today = new Date();

    const updatedForecast = response.data.map((item, index) => {

      const newDate = new Date();
      newDate.setDate(today.getDate() + index);

      return {
        ...item,
        ds: newDate.toISOString().split("T")[0]
      };

    });

    res.json(updatedForecast);

  } catch (error) {
    console.error("Forecast error:", error.message);
    res.status(500).json({ error: "Failed to fetch forecast" });
  }
});

/* MODEL METRICS */
router.get("/metrics", async (req, res) => {
  try {

    const response = await axios.get("http://127.0.0.1:8000/metrics");

    res.json(response.data);

  } catch (error) {
    console.error("Metrics error:", error.message);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

export default router;