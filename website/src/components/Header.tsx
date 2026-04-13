import { Link } from "react-router-dom";

function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        backgroundColor: "#2e7d32",
        color: "#fff",
      }}
    >
      <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
        <strong style={{ fontSize: "1.25rem" }}>The Green Resourcerers</strong>
      </Link>
      <nav style={{ display: "flex", gap: "1.5rem" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          Home
        </Link>
        <Link to="/request" style={{ color: "#fff", textDecoration: "none" }}>
          Request Pickup
        </Link>
      </nav>
    </header>
  );
}

export default Header;
