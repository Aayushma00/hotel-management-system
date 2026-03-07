import { useEffect, useState } from "react";
import axios from "axios";

import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function Dashboard() {

  const [stats, setStats] = useState({});
  const [revenue, setRevenue] = useState({});
  const [forecast, setForecast] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [predictedRevenue, setPredictedRevenue] = useState(0);

  const fetchStats = async () => {
    const res = await axios.get("http://localhost:5000/api/dashboard/room-stats");
    setStats(res.data);
  };

  const fetchRevenue = async () => {
    const res = await axios.get("http://localhost:5000/api/dashboard/revenue");
    setRevenue(res.data);
  };

  const fetchForecast = async () => {
    const res = await axios.get("http://localhost:5000/api/forecast");
    setForecast(res.data);
  };

  const fetchMetrics = async () => {
    const res = await axios.get("http://localhost:5000/api/forecast/metrics");
    setMetrics(res.data);
  };

  const fetchPredictedRevenue = async () => {
    const res = await axios.get("http://localhost:5000/api/dashboard/predicted-revenue");
    setPredictedRevenue(res.data.predictedRevenue);
  };

  useEffect(() => {
    fetchStats();
    fetchRevenue();
    fetchForecast();
    fetchMetrics();
    fetchPredictedRevenue();
  }, []);

  const calculateRisk = () => {
    if (!forecast.length || !stats.totalRooms) return "-";

    const next7Days = forecast.slice(0, 7);
    const totalRooms = Number(stats.totalRooms);

    const highRisk = next7Days.some(
      day => day.yhat_upper >= totalRooms
    );

    const mediumRisk = next7Days.some(
      day => day.yhat >= totalRooms * 0.9
    );

    if (highRisk) return "HIGH";
    if (mediumRisk) return "MEDIUM";
    return "LOW";
  };

  return (
    <div style={{
      paddingBottom: "80px",
      position: "relative",
      minHeight: "100vh",
      background: `
        radial-gradient(circle at top right, rgba(107,142,122,0.18), transparent 45%),
        radial-gradient(circle at bottom left, rgba(168,195,181,0.18), transparent 45%)
      `
    }}>

      {/* DASHBOARD GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "26px",
        marginBottom: "60px",
        position: "relative",
        zIndex: 1
      }}>

        <Card title="Total Rooms" value={stats.totalRooms} />
        <Card title="Available" value={stats.available} />
        <Card title="Occupied" value={stats.occupied} />
        <Card title="Maintenance" value={stats.maintenance} />
        <Card title="Occupancy Rate" value={stats.occupancyRate} suffix="%" />

        <Card title="Today's Revenue" value={revenue.todayRevenue} prefix="Rs " />
        <Card title="Monthly Revenue" value={revenue.monthlyRevenue} prefix="Rs " />
        <Card title="Total Revenue" value={revenue.totalRevenue} prefix="Rs " />
        <Card title="Predicted Revenue (Next 30 Days)" value={predictedRevenue} prefix="Rs " />

      </div>

      {/* FORECAST */}
      <h3 style={{
        color: "#2F3E34",
        marginBottom: "20px",
        fontSize: "20px",
        fontWeight: "600"
      }}>
        AI Booking Forecast
      </h3>

      <div style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(244,247,245,0.85))",
        backdropFilter: "blur(14px)",
        padding: "35px",
        borderRadius: "22px",
        border: "1px solid rgba(107,142,122,0.15)",
        boxShadow: "0 20px 45px rgba(0,0,0,0.06)",
        height: "460px",
        marginBottom: "60px",
        position: "relative",
        zIndex: 1
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecast}>

            <defs>
              <linearGradient id="mainAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6B8E7A" stopOpacity={0.35}/>
                <stop offset="100%" stopColor="#6B8E7A" stopOpacity={0.02}/>
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#E8EFEA" strokeDasharray="3 3" />
            <XAxis dataKey="ds" stroke="#2F3E34" />
            <YAxis stroke="#2F3E34" />
            <Tooltip />

            {/* Confidence Band Fill */}
            <Area
              type="monotone"
              dataKey="yhat_upper"
              stroke="transparent"
              fill="rgba(107,142,122,0.08)"
            />

            {/* Main Line with Fill */}
            <Line
              type="monotone"
              dataKey="yhat"
              stroke="#475d51"
              strokeWidth={4}
              dot={false}
              style={{
                filter: "drop-shadow(0px 0px 8px rgba(92, 123, 105, 0.5))"
              }}
            />

            {/* Lower & Upper dashed lines */}
            <Line
              type="monotone"
              dataKey="yhat_lower"
              stroke="#8c9592"
              strokeDasharray="5 5"
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="yhat_upper"
              stroke="#4c6c5c"
              strokeDasharray="5 5"
              dot={false}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI INSIGHTS */}
      <h3 style={{
        color: "#2F3E34",
        marginBottom: "20px",
        fontSize: "20px",
        fontWeight: "600"
      }}>
        AI Insights
      </h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "26px",
        position: "relative",
        zIndex: 1
      }}>
        <Card title="Predicted Bookings Tomorrow"
          value={forecast.length ? Math.round(forecast[1]?.yhat) : "-"} />

        <Card title="Overbooking Risk (Next 7 Days)"
          value={calculateRisk()} isRisk />

        <Card title="Model Accuracy" value={metrics.accuracy} suffix="%" />
        <Card title="MAE" value={metrics.mae} />
        <Card title="RMSE" value={metrics.rmse} />
      </div>

    </div>
  );
}

/* -------- GLASSY CARD (ENHANCED) -------- */

function Card({ title, value, prefix = "", suffix = "", isRisk = false }) {

  const riskColor =
    value === "HIGH" ? "#C05656" :
    value === "MEDIUM" ? "#D69E2E" :
    value === "LOW" ? "#6B8E7A" :
    "#2F3E34";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(14px)",
        padding: "26px",
        borderRadius: "20px",
        border: "1px solid rgba(107,142,122,0.15)",
        boxShadow: "0 14px 35px rgba(0,0,0,0.06)",
        transition: "all 0.3s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow =
          "0 22px 45px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow =
          "0 14px 35px rgba(0,0,0,0.06)";
      }}
    >
      <h4 style={{
        color: "#6B8E7A",
        fontSize: "13px",
        fontWeight: "600",
        marginBottom: "14px",
        letterSpacing: "0.5px"
      }}>
        {title}
      </h4>

      <p style={{
        fontSize: "28px",
        fontWeight: "700",
        color: isRisk ? riskColor : "#2F3E34",
        margin: 0
      }}>
        {typeof value === "number"
          ? <>
              {prefix}
              {value}
              {suffix}
            </>
          : value}
      </p>
    </div>
  );
}