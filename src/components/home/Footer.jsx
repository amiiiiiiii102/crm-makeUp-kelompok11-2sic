// src/components/Footer.jsx
import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const iconTextStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  };

  return (
    <footer style={{
      backgroundColor: "#1e1e1e",
      color: "#ffffff",
      padding: "40px 30px",
      fontSize: 14
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 40,
        marginBottom: 30
      }}>
        {/* Contact Us */}
        <div>
          <h4 style={{ marginBottom: 16, fontSize: 16 }}>CONTACT US</h4>
          <div style={iconTextStyle}>
            <MapPin size={14} />
            <span>Jl. Suka Karya, Pekanbaru, Riau</span>
          </div>
          <div style={iconTextStyle}>
            <Phone size={14} />
            <span>(+62) 813-3772-3772</span>
          </div>
          <div style={iconTextStyle}>
            <Mail size={14} />
            <span>istana.cosmetic@gmail.com</span>
          </div>
        </div>

        {/* Opening Times */}
        <div>
          <h4 style={{ marginBottom: 16, fontSize: 16 }}>OPENING TIMES</h4>
          <p>09:30 AM – 10:00 PM</p>
          <p>Setiap Hari (Senin – Minggu)</p>
        </div>

        {/* Follow Us (Instagram) */}
        <div>
          <h4 style={{ marginBottom: 16, fontSize: 16 }}>FOLLOW US</h4>
          <div style={iconTextStyle}>
            <Instagram size={14} />
            <a
              href="https://www.instagram.com/istana.cosmetics"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#f37021", textDecoration: "none" }}
            >
              @istana.cosmetics
            </a>
          </div>
          <p style={{ fontSize: 12, color: "#aaa", marginTop: 8 }}>
            Follow kami untuk promo & update terbaru!
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div style={{
        borderTop: "1px solid #333",
        paddingTop: 20,
        textAlign: "center",
        fontSize: 13,
        color: "#ccc"
      }}>
        © 2025 Istana Cosmetic. Cantik itu pilihan, percaya diri itu kekuatan.
      </div>
    </footer>
  );
}
