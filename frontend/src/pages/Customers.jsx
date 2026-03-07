import { useEffect, useState } from "react";
import axios from "axios";

export default function Customers() {

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nationalityFilter, setNationalityFilter] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    nationality: "",
    id_proof_number: ""
  });

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customers");
      setCustomers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const createCustomer = async () => {
    if (!form.first_name || !form.last_name) {
      alert("First name and last name are required");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/customers", form);

      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        nationality: "",
        id_proof_number: ""
      });

      setShowForm(false);
      fetchCustomers();
    } catch (error) {
      alert("Failed to create customer");
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();

    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesNationality =
      nationalityFilter === "" ||
      c.nationality === nationalityFilter;

    return matchesSearch && matchesNationality;
  });

  const uniqueNationalities = [
    ...new Set(customers.map(c => c.nationality).filter(Boolean))
  ];

  return (
    <div style={pageWrapper}>

      {/* HEADER BLOCK */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{
          color: "#2F3E34",
          fontSize: "22px",
          fontWeight: "600",
          marginBottom: "6px"
        }}>
          Customers
        </h2>
        <p style={{
          color: "#6B8E7A",
          fontSize: "14px"
        }}>
          Manage customer profiles and guest information
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div style={{
        display: "flex",
        gap: "14px",
        marginBottom: "24px",
        flexWrap: "wrap"
      }}>

        <input
          type="text"
          placeholder="🔍 Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchStyle}
        />

        <select
          value={nationalityFilter}
          onChange={(e) => setNationalityFilter(e.target.value)}
          style={searchStyle}
        >
          <option value="">All Nationalities</option>
          {uniqueNationalities.map((n, index) => (
            <option key={index} value={n}>{n}</option>
          ))}
        </select>

      </div>

      {/* TABLE */}
      <div style={tableContainer}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#F4F7F5" }}>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Nationality</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((c, index) => (
              <tr
                key={c.id}
                style={{
                  ...rowStyle,
                  animationDelay: `${index * 0.04}s`
                }}
              >
                <td style={tdStyle}>{c.id}</td>
                <td style={tdStyle}>{c.first_name} {c.last_name}</td>
                <td style={tdStyle}>{c.email}</td>
                <td style={tdStyle}>{c.phone}</td>
                <td style={tdStyle}>{c.nationality}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setShowForm(true)}
        style={floatingButton}
      >
        + Add Customer
      </button>

      {/* MODAL */}
      {showForm && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <h3 style={{
              marginBottom: "18px",
              color: "#2F3E34"
            }}>
              Add New Customer
            </h3>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>
              {Object.keys(form).map((key) => (
                <input
                  key={key}
                  placeholder={key.replace("_", " ").toUpperCase()}
                  value={form[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                  style={inputStyle}
                />
              ))}
            </div>

            <div style={{
              marginTop: "18px",
              display: "flex",
              gap: "10px"
            }}>
              <button onClick={createCustomer} style={primaryButton}>
                Save
              </button>
              <button
                onClick={() => setShowForm(false)}
                style={secondaryButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* 🌿 PAGE BACKGROUND GRADIENT */
const pageWrapper = {
  paddingTop: "10px",
  paddingBottom: "60px",
  background: `
    radial-gradient(circle at top right, rgba(107,142,122,0.10), transparent 40%),
    radial-gradient(circle at bottom left, rgba(168,195,181,0.10), transparent 40%)
  `
};

const searchStyle = {
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid #E4ECE8",
  background: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(10px)",
  fontSize: "14px"
};

const tableContainer = {
  background: "#FFFFFF",
  borderRadius: "18px",
  border: "1px solid #E4ECE8",
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0,0,0,0.04)"
};

const thStyle = {
  padding: "14px 16px",
  fontSize: "13px",
  color: "#6B8E7A",
  textAlign: "left",
  fontWeight: "600"
};

const tdStyle = {
  padding: "14px 16px",
  fontSize: "14px",
  color: "#2F3E34"
};

const rowStyle = {
  borderBottom: "1px solid #E4ECE8",
  animation: "fadeInUp 0.4s ease forwards",
  opacity: 0
};

const floatingButton = {
  position: "fixed",
  bottom: "40px",
  right: "calc((100vw - 1100px) / 2 + 20px)",
  background: "#6B8E7A",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "50px",
  padding: "14px 22px",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(0,0,0,0.12)"
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.25)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalCard = {
  background: "#FFFFFF",
  padding: "28px",
  borderRadius: "18px",
  width: "380px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.12)"
};

const inputStyle = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #E4ECE8"
};

const primaryButton = {
  padding: "10px 16px",
  borderRadius: "10px",
  border: "none",
  background: "#6B8E7A",
  color: "#FFFFFF",
  cursor: "pointer"
};

const secondaryButton = {
  padding: "10px 16px",
  borderRadius: "10px",
  border: "1px solid #E4ECE8",
  background: "#F4F7F5",
  cursor: "pointer"
};

const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
tr:hover {
  background: #F9FBFA;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.04);
}
`;
document.head.appendChild(styleSheet);