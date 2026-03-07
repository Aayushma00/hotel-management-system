import { useEffect, useState } from "react";
import axios from "axios";

export default function Rooms() {

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [typeFilter, setTypeFilter] = useState("All");

  const fetchRooms = async () => {
    const res = await axios.get("http://localhost:5000/api/rooms");
    setRooms(res.data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  /* ---------------- FILTER ---------------- */

  const filteredRooms =
    typeFilter === "All"
      ? rooms
      : rooms.filter(r => r.room_type === typeFilter);

  /* ---------------- STATUS STYLE ---------------- */

  const statusColors = {
    available: "#6B8E7A",
    occupied: "#B45A5A",
    maintenance: "#D4A34B"
  };

  const updateStatus = async (status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/rooms/status/${selectedRoom.id}`,
        { status }
      );
      fetchRooms();
      setSelectedRoom({ ...selectedRoom, status });
    } catch {
      alert("Failed to update status");
    }
  };

  return (
    <div style={{ paddingBottom: "60px" }}>

      {/* PAGE HEADER */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={titleStyle}>Room Management</h2>
        <p style={subtitleStyle}>
          Manage room availability and status
        </p>
      </div>

      {/* TYPE FILTER */}
      <div style={{ marginBottom: "25px", display: "flex", gap: "12px" }}>
        {["All", "Standard", "Deluxe", "Suite"].map(type => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            style={{
              ...filterButton,
              background:
                typeFilter === type
                  ? "#6B8E7A"
                  : "rgba(255,255,255,0.7)",
              color:
                typeFilter === type
                  ? "white"
                  : "#2F3E34"
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* ROOM GRID */}
      <div style={gridStyle}>
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            onClick={() => setSelectedRoom(room)}
            style={{
              ...cardStyle,
              boxShadow:
                room.status === "available"
                  ? "0 10px 30px rgba(107,142,122,0.15)"
                  : room.status === "occupied"
                  ? "0 10px 30px rgba(180,90,90,0.15)"
                  : "0 10px 30px rgba(212,163,75,0.15)"
            }}
            className="room-card"
          >

            {/* PRICE BADGE */}
            <div style={priceBadge}>
              Rs {room.price_per_night}
            </div>

            {/* ROOM NUMBER CIRCLE */}
            <div style={roomCircle}>
              {room.room_number}
            </div>

            <h3 style={roomTitle}>
              {room.room_type}
            </h3>

            <div
              style={{
                ...statusBadge,
                background: statusColors[room.status] + "20",
                color: statusColors[room.status],
                border: `1px solid ${statusColors[room.status]}`
              }}
            >
              {room.status.toUpperCase()}
            </div>

          </div>
        ))}
      </div>

      {/* DETAILS PANEL */}
      {selectedRoom && (
        <div style={detailsPanel}>
          <h3 style={{ marginBottom: "15px" }}>
            Room {selectedRoom.room_number}
          </h3>

          <p><b>Type:</b> {selectedRoom.room_type}</p>
          <p><b>Price:</b> Rs {selectedRoom.price_per_night}</p>

          {/* STATUS TOGGLE */}
          <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
            {["available", "maintenance"].map(status => (
              <button
                key={status}
                onClick={() => updateStatus(status)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "30px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  background:
                    selectedRoom.status === status
                      ? statusColors[status]
                      : "#E4ECE8",
                  color:
                    selectedRoom.status === status
                      ? "white"
                      : "#2F3E34"
                }}
              >
                {status.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MICRO ANIMATIONS */}
      <style>
        {`
        .room-card {
          transition: all 0.25s ease;
          position: relative;
          cursor: pointer;
        }
        .room-card:hover {
          transform: translateY(-6px);
          border: 1px solid rgba(107,142,122,0.4);
        }
        .room-card:active {
          transform: scale(0.98);
        }
        `}
      </style>

    </div>
  );
}

/* ---------------- STYLES ---------------- */

const titleStyle = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#2F3E34",
  marginBottom: "5px"
};

const subtitleStyle = {
  fontSize: "14px",
  color: "#6B8E7A"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "24px"
};

const cardStyle = {
  padding: "26px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.75)",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(255,255,255,0.5)",
  textAlign: "center"
};

const priceBadge = {
  position: "absolute",
  top: "16px",
  right: "16px",
  background: "#6B8E7A",
  color: "white",
  padding: "5px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600"
};

const roomCircle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "#F4F7F5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  fontSize: "16px",
  margin: "0 auto 15px auto"
};

const roomTitle = {
  fontSize: "16px",
  marginBottom: "12px",
  color: "#2F3E34"
};

const statusBadge = {
  display: "inline-block",
  padding: "6px 14px",
  borderRadius: "50px",
  fontSize: "12px",
  fontWeight: "600"
};

const detailsPanel = {
  marginTop: "50px",
  padding: "30px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(14px)",
  boxShadow: "0 15px 40px rgba(0,0,0,0.05)"
};

const filterButton = {
  padding: "8px 16px",
  borderRadius: "30px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
  transition: "0.2s"
};