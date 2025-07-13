import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Produk from "./Produk";
import Testimoni from "./Testimoni";
import Artikel from "./Artikel";
import TokoPage from "./TokoPage";
import FAQ from "./Faq";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Prediksi from "../../pages/Prediksi";

// Gambar hero
const backgroundImages = [
  "/images/bg1.jpg",
  "/images/bg2.jpg",
  "/images/bg3.jpg"
];

export default function Home() {
  const [activeNav, setActiveNav] = useState("home");
  const [bgIndex, setBgIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  // Auto ganti background tiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll tracking
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
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  return (
    <div>
      <Navbar activeNav={activeNav} />

      {/* HERO SECTION */}
      <section
        id="home"
        style={{
          position: "relative",
          backgroundImage: `url(${backgroundImages[bgIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
          transition: "background-image 1s ease-in-out",
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            backgroundColor: "rgba(255, 102, 0, 0.2)",
            zIndex: 1,
          }}
        />

        {/* Konten */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: "90%", textAlign: "center" }}>
          <h1
            style={{
              fontSize: 48,
              marginBottom: 10,
              fontWeight: 800,
              textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
            }}
          >
            Selamat Datang di <span style={{ color: "#ffd9b3" }}>Istana Cosmetic</span>
          </h1>
          <p
            style={{
              fontSize: 20,
              marginBottom: 24,
              fontWeight: 600,
              textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
            }}
          >
            Kecantikan yang membuatmu percaya diri setiap hari.
          </p>

          <button
            onClick={() => setShowPopup(true)}
            style={{
              backgroundColor: "#f37021",
              color: "white",
              padding: "12px 24px",
              fontSize: "16px",
              border: "none",
              borderRadius: "999px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#d95d17";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#f37021";
              e.target.style.transform = "scale(1)";
            }}
          >
            Temukan Shade Mu! 💄
          </button>
        </div>

        {/* Panah Navigasi Manual */}
        <div style={{ position: "absolute", top: "50%", left: 20, zIndex: 3, transform: "translateY(-50%)" }}>
          <button
            onClick={() => setBgIndex((bgIndex - 1 + backgroundImages.length) % backgroundImages.length)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <ChevronLeft color="#fff" size={40} />
          </button>
        </div>
        <div style={{ position: "absolute", top: "50%", right: 20, zIndex: 3, transform: "translateY(-50%)" }}>
          <button
            onClick={() => setBgIndex((bgIndex + 1) % backgroundImages.length)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <ChevronRight color="#fff" size={40} />
          </button>
        </div>

        {/* Dots indikator */}
        <div style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          zIndex: 3,
        }}>
          {backgroundImages.map((_, i) => (
            <div
              key={i}
              onClick={() => setBgIndex(i)}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: bgIndex === i ? "#fff" : "#aaa",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </section>

      {/* SECTIONS */}
      <div><Produk withLayout={false} /></div>
      <div><Testimoni withLayout={false} /></div>
      <div><Artikel withLayout={false} /></div>

      <div><FAQ withLayout={false} /></div>
      <div><TokoPage withLayout={false} /></div>

      <Footer />

      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "32px",
              padding: "2rem 1.5rem",
              maxHeight: "90vh",
              overflowY: "auto",
              width: "90%",
              maxWidth: "720px",
              position: "relative",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            {/* Tombol Close Bulat */}
            <button
              onClick={() => setShowPopup(false)}
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                background: "#ffe9dd",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                fontSize: "18px",
                fontWeight: "bold",
                color: "#b4380d",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
              }}
              aria-label="Tutup"
            >
              ✕
            </button>

            {/* Komponen Prediksi */}
            <Prediksi />
          </div>
        </div>
      )}
    </div>
  );
}
