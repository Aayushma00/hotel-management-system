import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import bookingRoutes from "./routes/bookingRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import forecastRoutes from "./routes/forecastRoutes.js";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();

const app = express();

/* MIDDLEWARE */

app.use(cors());
app.use(express.json());

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/forecast", forecastRoutes);

/* TEST ROUTE */

app.get("/", (req, res) => {
  res.send("Hotel Management API running...");
});

/* SERVER */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});