import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#F4F7F5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden"
      }}
    >

      {/* 🌿 DREAMY BACKGROUND BLOBS */}
      <div style={bgBlob1} />
      <div style={bgBlob2} />

      {/* GLASS LOGIN CARD */}
      <div
        style={{
          width: "380px",
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          padding: "50px 40px",
          borderRadius: "28px",
          border: "1px solid rgba(255,255,255,0.4)",
          boxShadow: "0 20px 60px rgba(107,142,122,0.18)",
          position: "relative",
          zIndex: 2,
          animation: "fadeInLogin 0.8s ease forwards"
        }}
      >
        <h2
          style={{
            marginBottom: "40px",
            color: "#2F3E34",
            textAlign: "center",
            fontWeight: "600",
            fontSize: "22px",
            letterSpacing: "0.5px"
          }}
        >
          Welcome Back 🌿
        </h2>

        {/* Email */}
        <div style={{ marginBottom: "25px" }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            style={inputStyle}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "35px" }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            style={inputStyle}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          style={buttonStyle}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow =
              "0 10px 25px rgba(107,142,122,0.35)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0px)";
            e.target.style.boxShadow =
              "0 6px 18px rgba(107,142,122,0.25)";
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const labelStyle = {
  fontSize: "14px",
  color: "#2F3E34",
  display: "block",
  marginBottom: "8px",
  fontWeight: "500"
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #E4ECE8",
  outline: "none",
  fontSize: "14px",
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(6px)",
  transition: "all 0.2s ease",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(135deg, #6B8E7A, #5A7C69)",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "16px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 6px 18px rgba(107,142,122,0.25)"
};

/* ---------- DREAMY BACKGROUND BLOBS ---------- */

const bgBlob1 = {
  position: "absolute",
  width: "420px",
  height: "420px",
  background:
    "radial-gradient(circle, rgba(107,142,122,0.35), transparent 70%)",
  top: "-120px",
  left: "-100px",
  filter: "blur(90px)"
};

const bgBlob2 = {
  position: "absolute",
  width: "350px",
  height: "350px",
  background:
    "radial-gradient(circle, rgba(168,195,181,0.4), transparent 70%)",
  bottom: "-100px",
  right: "-100px",
  filter: "blur(80px)"
};

/* ---------- ANIMATION ---------- */

const styleTag = document.createElement("style");
styleTag.innerHTML = `
@keyframes fadeInLogin {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(styleTag);