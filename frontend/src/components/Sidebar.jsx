import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        background: "linear-gradient(180deg, #DDE8E3, #F4F7F5)",
        color: "#2F3E34",
        padding: "30px 20px",
        position: "fixed",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid #E4ECE8"
      }}
    >
      {/* TOP SECTION */}
      <div>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "40px",
            letterSpacing: "0.5px"
          }}
        >
          Hotel System 🌿
        </h2>

        <nav>

          <NavItem to="/" label="Dashboard" />
          <NavItem to="/rooms" label="Rooms" />
          <NavItem to="/bookings" label="Bookings" />
          <NavItem to="/customers" label="Customers" />

        </nav>
      </div>

      {/* BOTTOM SECTION - DREAMY LOGOUT */}
      <div
        style={{
          borderTop: "1px solid #E4ECE8",
          paddingTop: "25px",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Link
          to="/login"
          style={{
            textDecoration: "none",
            padding: "10px 22px",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: "600",
            letterSpacing: "0.5px",
            color: "#2F3E34",
            background: "linear-gradient(135deg, #EAF3EF, #FFFFFF)",
            border: "1px solid #E4ECE8",
            boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
            transition: "all 0.25s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#6B8E7A";
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow =
              "0 10px 22px rgba(107,142,122,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, #EAF3EF, #FFFFFF)";
            e.currentTarget.style.color = "#2F3E34";
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(0,0,0,0.05)";
          }}
        >
          Logout
        </Link>
      </div>
    </div>
  );
}

/* DREAMY NAV ITEM */
function NavItem({ to, label }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <Link
        to={to}
        style={{
          display: "block",
          padding: "10px 14px",
          borderRadius: "10px",
          textDecoration: "none",
          fontSize: "15px",
          fontWeight: "500",
          color: "#2F3E34",
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#6B8E7A";
          e.currentTarget.style.color = "#FFFFFF";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#2F3E34";
        }}
      >
        {label}
      </Link>
    </div>
  );
}

export default Sidebar;