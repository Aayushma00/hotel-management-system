import { useEffect, useState } from "react";
import axios from "axios";

export default function Bookings() {

  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    customer_id: "",
    room_id: "",
    check_in_date: "",
    check_out_date: ""
  });

  /* FETCH BOOKINGS */
  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCustomers = async () => {
    const res = await axios.get("http://localhost:5000/api/customers");
    setCustomers(res.data);
  };

  const fetchRooms = async () => {
    const res = await axios.get("http://localhost:5000/api/rooms");
    setRooms(res.data);
  };

  useEffect(() => {
    fetchBookings();
    fetchCustomers();
    fetchRooms();
  }, []);

  /* CREATE BOOKING */
  const createBooking = async () => {

    // 🔒 Frontend Validation
    if (!form.customer_id || !form.room_id) {
      alert("Please select customer and room");
      return;
    }

    if (!form.check_in_date || !form.check_out_date) {
      alert("Please select check-in and check-out dates");
      return;
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    const checkIn = new Date(form.check_in_date);
    checkIn.setHours(0,0,0,0);

    const checkOut = new Date(form.check_out_date);
    checkOut.setHours(0,0,0,0);

    if (checkIn < today) {
      alert("Check-in date cannot be in the past");
      return;
    }

    if (checkOut <= checkIn) {
      alert("Check-out must be after check-in");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/bookings", {
        customer_id: parseInt(form.customer_id),
        room_id: parseInt(form.room_id),
        check_in_date: form.check_in_date,
        check_out_date: form.check_out_date
      });

      setIsModalOpen(false);

      setForm({
        customer_id: "",
        room_id: "",
        check_in_date: "",
        check_out_date: ""
      });

      fetchBookings();
      fetchRooms();

    } catch (err) {
      alert(err.response?.data?.error || "Booking failed");
    }
  };

  const cancelBooking = async (id) => {
    await axios.put(`http://localhost:5000/api/bookings/cancel/${id}`);
    fetchBookings();
    fetchRooms();
  };

  const checkoutBooking = async (id) => {
    await axios.put(`http://localhost:5000/api/bookings/complete/${id}`);
    fetchBookings();
    fetchRooms();
  };

  const todayString = new Date().toISOString().split("T")[0];

  return (
    <div style={{ paddingTop: "10px", paddingBottom: "50px" }}>

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px"
        }}
      >
        <div>
          <h2 style={{
            color: "#2F3E34",
            fontSize: "22px",
            fontWeight: "600",
            marginBottom: "4px"
          }}>
            Bookings
          </h2>
          <p style={{
            color: "#6B8E7A",
            fontSize: "14px"
          }}>
            Manage hotel reservations
          </p>
        </div>

        <button style={primaryButton} onClick={() => setIsModalOpen(true)}>
          + New Booking
        </button>
      </div>

      {/* TABLE */}
      <div style={glassBox}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Customer</th>
              <th style={th}>Room</th>
              <th style={th}>Check In</th>
              <th style={th}>Check Out</th>
              <th style={th}>Total</th>
              <th style={th}>Status</th>
              <th style={th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, index) => (
              <tr
                key={b.id}
                style={{
                  ...rowStyle,
                  animationDelay: `${index * 0.04}s`
                }}
              >
                <td style={td}>{b.customer}</td>
                <td style={td}>{b.room_number}</td>
                <td style={td}>{new Date(b.check_in_date).toLocaleDateString()}</td>
                <td style={td}>{new Date(b.check_out_date).toLocaleDateString()}</td>
                <td style={td}>Rs {b.total_amount}</td>
                <td style={td}><StatusBadge status={b.booking_status} /></td>
                <td style={td}>
                  {b.booking_status === "confirmed" ? (
                    <>
                      <button style={dangerButton} onClick={() => cancelBooking(b.id)}>Cancel</button>
                      <button style={successButton} onClick={() => checkoutBooking(b.id)}>Checkout</button>
                    </>
                  ) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3 style={{ marginBottom: "18px" }}>Create Booking</h3>

            <select
              style={inputStyle}
              value={form.customer_id}
              onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
            >
              <option value="">Select Customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.first_name} {c.last_name}
                </option>
              ))}
            </select>

            <select
              style={inputStyle}
              value={form.room_id}
              onChange={(e) => setForm({ ...form, room_id: e.target.value })}
            >
              <option value="">Select Room</option>
              {rooms.filter(r => r.status === "available")
                .map(r => (
                  <option key={r.id} value={r.id}>
                    Room {r.room_number} - Rs {r.price_per_night}
                  </option>
                ))}
            </select>

            {/* 🔥 Updated Date Inputs */}
            <input
              type="date"
              min={todayString}
              value={form.check_in_date}
              style={inputStyle}
              onChange={(e) =>
                setForm({ ...form, check_in_date: e.target.value })
              }
            />

            <input
              type="date"
              min={form.check_in_date || todayString}
              value={form.check_out_date}
              style={inputStyle}
              onChange={(e) =>
                setForm({ ...form, check_out_date: e.target.value })
              }
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
              <button style={primaryButton} onClick={createBooking}>Save</button>
              <button style={secondaryButton} onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

/* ---------- STYLES ---------- */

const glassBox = {
  background: "rgba(255,255,255,0.65)",
  backdropFilter: "blur(16px)",
  borderRadius: "18px",
  padding: "22px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.04)"
};

const rowStyle = {
  borderTop: "1px solid #E4ECE8",
  animation: "fadeUp 0.5s ease forwards",
  opacity: 0
};

const th = {
  padding: "12px 10px",
  textAlign: "left",
  color: "#6B8E7A",
  fontSize: "13px",
  fontWeight: "600"
};

const td = {
  padding: "12px 10px",
  color: "#2F3E34",
  fontSize: "14px"
};

const primaryButton = {
  background: "#6B8E7A",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer"
};

const secondaryButton = {
  background: "#E4ECE8",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer"
};

const successButton = {
  background: "#4E6F5E",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  marginRight: "6px"
};

const dangerButton = {
  background: "#C05656",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  marginRight: "6px"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #E4ECE8",
  marginBottom: "12px"
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.2)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalBox = {
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(18px)",
  padding: "28px",
  borderRadius: "18px",
  width: "380px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.08)"
};

function StatusBadge({ status }) {
  const colors = {
    confirmed: "#6B8E7A",
    completed: "#4E6F5E",
    cancelled: "#C05656"
  };

  return (
    <span style={{
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      background: colors[status] + "20",
      color: colors[status],
      border: `1px solid ${colors[status]}`
    }}>
      {status?.toUpperCase()}
    </span>
  );
}

const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);