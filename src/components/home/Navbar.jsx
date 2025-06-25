import { useNavigate, Link } from "react-router-dom";

export default function Navbar({ activeNav }) {
  const navigate = useNavigate();

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "15px 40px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    position: "sticky",
    top: 0,
    zIndex: 100
  };

  const linkStyle = (id) => ({
    fontWeight: 500,
    color: activeNav === id ? "#f37021" : "#333333",
    borderBottom: activeNav === id ? "2px solid #f37021" : "none",
    textDecoration: "none"
  });

  return (
    <nav style={navStyle}>
      {/* Logo dan nama toko */} 
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/images/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
        <span style={{ fontSize: 20, fontWeight: "bold", color: "#f37021" }}>
          Istana Cosmetic
        </span>
      </div>

      {/* Navigasi utama */}
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <Link to="/" style={linkStyle("home")}>Home</Link>
        <Link to="/produk" style={linkStyle("produk")}>Produk</Link>
        <Link to="/testimoni" style={linkStyle("testimoni")}>Testimonial</Link>
        <Link to="/artikel" style={linkStyle("artikel")}>Artikel</Link>
        <Link to="/faq" style={linkStyle("faq")}>FAQ</Link>
        <Link to="/kontak" style={linkStyle("kontak")}>Kontak</Link>
      </div>

      {/* Tombol Login */}
      <div>
        <button
          onClick={() => navigate("/login")}
          style={{
            backgroundColor: "#ff8c42",
            color: "#ffffff",
            border: "none",
            padding: "8px 16px",
            borderRadius: 20,
            fontWeight: 500,
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </div>
    </nav>
  );
}
