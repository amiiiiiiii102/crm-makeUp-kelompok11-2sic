
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "produk", "testimoni", "artikel","faq", "TokoPage"];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveNav(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sectionStyle = {
    minHeight: "100vh",
    padding: "60px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  return (
    <div>
      <Navbar activeNav={activeNav} />

      {/* Hero Section */}
      <section id="home" style={{
        position: "relative",
        backgroundImage: "url(/images/bg2.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#ffffff",
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 102, 0, 0.2)",
          zIndex: 2
        }}></div>
        <div style={{ position: "relative", zIndex: 3, fontWeight: "bold" }}>
          <h1 style={{ fontSize: 48, marginBottom: 10 }}>Selamat Datang di Istana Cosmetic</h1>
          <p style={{ fontSize: 18, marginBottom: 20 }}>Kecantikan yang membuatmu percaya diri setiap hari.</p>
          <a href="/produk">
            <button style={{
              backgroundColor: "#f37021",
              color: "#ffffff",
              padding: "10px 24px",
              borderRadius: 30,
              fontWeight: "bold",
              transition: "0.3s",
              border: "none",
              cursor: "pointer",
            }}>Jelajahi Sekarang</button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}