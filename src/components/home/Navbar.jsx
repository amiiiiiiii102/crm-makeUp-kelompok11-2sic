import { useNavigate } from "react-router-dom";

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
      {/* Logo dan nama toko (rata kiri) */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/images/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
        <span style={{ fontSize: 20, fontWeight: "bold", color: "#f37021" }}>Istana Cosmetic</span>
      </div>

      {/* Navigasi utama (rata tengah) */}
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <a href="/" style={linkStyle("home")}>Home</a>
        <a href="/produk" style={linkStyle("produk")}>Produk</a>
        <a href="/testimoni" style={linkStyle("testimoni")}>Testimonial</a>
        <a href="/artikel" style={linkStyle("artikel")}>Artikel</a>
        <a href="/homefaq" style={linkStyle("faq")}>FAQ</a>
        <a href="/kontak" style={linkStyle("kontak")}>Kontak</a>
      </div>

      {/* Login (rata kanan) */}
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
