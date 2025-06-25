import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Produk from "./Produk";
import Testimoni from "./Testimoni";
import Artikel from "./Artikel";
import Kontak from "./Kontak";
import FAQ from "./Faq";

export default function Home() {
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "produk", "testimoni", "artikel", "faq", "kontak"];
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

  const buttonStyle = {
    backgroundColor: "#f37021",
    color: "#ffffff",
    padding: "10px 24px",
    borderRadius: 30,
    fontWeight: "bold",
    transition: "all 0.3s ease",
    border: "none",
    cursor: "pointer",
  };

  return (
    <div>
      <Navbar activeNav={activeNav} />

      {/* Hero Section */}
      <section
        id="home"
        style={{
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
          transition: "0.3s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 102, 0, 0.2)",
            zIndex: 2,
          }}
        ></div>
        <div style={{ position: "relative", zIndex: 3, fontWeight: "bold" }}>
          <h1 style={{ fontSize: 48, marginBottom: 10, animation: "fadeInDown 0.6s" }}>
            Selamat Datang di Istana Cosmetic
          </h1>
          <p style={{ fontSize: 18, marginBottom: 20, animation: "fadeInUp 0.6s" }}>
            Kecantikan yang membuatmu percaya diri setiap hari.
          </p>
          <a href="#produk">
            <button
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#d95d17";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#f37021";
                e.target.style.transform = "scale(1)";
              }}
            >
              Jelajahi Sekarang ✨
            </button>
          </a>
        </div>
      </section>

      {/* Produk Section */}
      <div style={{ transition: "opacity 0.5s ease-in" }}>
        <Produk withLayout={false} />
      </div>

      {/* Testimoni Section */}
      <div style={{ transition: "opacity 0.5s ease-in-out" }}>
        <Testimoni withLayout={false} />
      </div>

      {/* Artikel Section */}
      <div style={{ transition: "transform 0.5s ease-in-out" }}>
        <Artikel withLayout={false} />
      </div>

      {/* Spacer antara artikel dan faq */}
      <div style={{ height: 60, backgroundColor: "#fff6ea" }}></div>

      {/* FAQ Section */}
      <div style={{ transition: "opacity 0.5s ease-out" }}>
        <FAQ withLayout={false} />
      </div>

      {/* Kontak Section */}
      <div style={{ transition: "transform 0.4s ease-in-out" }}>
        <Kontak withLayout={false} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
