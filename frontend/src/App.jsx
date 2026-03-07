import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings";
import Customers from "./pages/Customers";
import Login from "./pages/Login";

function App() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);

  const navRef = useRef(null);
  const underlineRef = useRef(null);

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animated underline logic
  useEffect(() => {
    const activeLink = navRef.current?.querySelector(".active-nav");
    if (activeLink && underlineRef.current) {
      underlineRef.current.style.width = activeLink.offsetWidth + "px";
      underlineRef.current.style.left = activeLink.offsetLeft + "px";
    }
  }, [location]);

  if (location.pathname === "/login") {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        transition: "0.3s ease",
        background: darkMode
          ? "linear-gradient(135deg,#1f2a26,#24332e)"
          : "linear-gradient(135deg,#F4F7F5,#E8F0EC)"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(16px)",
          background: darkMode
            ? "rgba(36,51,46,0.75)"
            : "rgba(255,255,255,0.6)",
          borderBottom: darkMode
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid #E4ECE8",
          boxShadow: scrolled
            ? "0 6px 24px rgba(0,0,0,0.06)"
            : "none",
          transition: "all 0.3s ease"
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            height: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px"
          }}
        >
          {/* LOGO */}
          <div
            style={{
              fontSize: "19px",
              fontWeight: "600",
              color: darkMode ? "#FFFFFF" : "#2F3E34"
            }}
          >
            Hotel TreeTop 🌿
          </div>

          {/* NAVIGATION */}
          <div style={{ position: "relative" }}>
            <div
              ref={navRef}
              style={{
                display: "flex",
                gap: "26px",
                position: "relative"
              }}
            >
              <NavItem to="/" label="Dashboard" current={location.pathname} darkMode={darkMode} />
              <NavItem to="/rooms" label="Rooms" current={location.pathname} darkMode={darkMode} />
              <NavItem to="/bookings" label="Bookings" current={location.pathname} darkMode={darkMode} />
              <NavItem to="/customers" label="Customers" current={location.pathname} darkMode={darkMode} />

              {/* UNDERLINE SLIDER */}
              <div
                ref={underlineRef}
                style={{
                  position: "absolute",
                  bottom: "-8px",
                  height: "3px",
                  background: "#6B8E7A",
                  borderRadius: "2px",
                  transition: "all 0.3s ease"
                }}
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

            {/* NOTIFICATION BELL */}
            <div style={{ position: "relative" }}>
              <div
                onClick={() => setOpenNotif(!openNotif)}
                style={{
                  cursor: "pointer",
                  fontSize: "18px"
                }}
              >
                🔔
              </div>

              {openNotif && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "40px",
                    width: "200px",
                    background: darkMode ? "#24332e" : "#FFFFFF",
                    borderRadius: "12px",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
                    padding: "12px",
                    fontSize: "14px",
                    animation: "fadeIn 0.2s ease"
                  }}
                >
                  No new notifications
                </div>
              )}
            </div>

            {/* DARK MODE */}
            <div
              onClick={() => setDarkMode(!darkMode)}
              style={{ cursor: "pointer", fontSize: "18px" }}
            >
              {darkMode ? "☀️" : "🌙"}
            </div>

            {/* PROFILE */}
            <div style={{ position: "relative" }}>
              <div
                onClick={() => setOpenProfile(!openProfile)}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#A8C3B5,#6B8E7A)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                A
              </div>

              {openProfile && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "48px",
                    width: "150px",
                    background: darkMode ? "#24332e" : "#FFFFFF",
                    borderRadius: "12px",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
                    padding: "8px",
                    animation: "fadeIn 0.2s ease"
                  }}
                >
                  <Link
                    to="/login"
                    style={{
                      display: "block",
                      padding: "8px 10px",
                      textDecoration: "none",
                      color: darkMode ? "#FFFFFF" : "#2F3E34"
                    }}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* PAGE CONTENT WITH SMOOTH TRANSITION */}
      <div
        key={location.pathname}
        style={{
          maxWidth: "1100px",
          margin: "40px auto 70px auto",
          padding: "0 24px",
          animation: "pageFade 0.35s ease"
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes pageFade {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

function NavItem({ to, label, current, darkMode }) {
  const isActive = current === to;

  return (
    <Link
      to={to}
      className={isActive ? "active-nav" : ""}
      style={{
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: isActive ? "600" : "500",
        color: darkMode ? "#FFFFFF" : "#2F3E34",
        position: "relative"
      }}
    >
      {label}
    </Link>
  );
}

export default App;