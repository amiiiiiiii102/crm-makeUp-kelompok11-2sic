import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "produk", "testimoni", "artikel", "kontak"];
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

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <a href="#home" className={activeNav === "home" ? "active-nav" : ""}>Home</a>
          <a href="#produk" className={activeNav === "produk" ? "active-nav" : ""}>Produk</a>
          <a href="#testimoni" className={activeNav === "testimoni" ? "active-nav" : ""}>Testimonial</a>
        </div>
        <div className="navbar-center">
          <img src="/images/logo.png" alt="Logo" className="logo" />
          <span className="shop-name">Istana Cosmetic</span>
        </div>
        <div className="navbar-right">
          <a href="#artikel" className={activeNav === "artikel" ? "active-nav" : ""}>Artikel</a>
          <a href="#kontak" className={activeNav === "kontak" ? "active-nav" : ""}>Kontak</a>
          <button className="btn-login" onClick={() => navigate("/login")}>Login</button>
        </div>
      </nav>

      {/* Home Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <h1>Selamat Datang di Istana Cosmetic</h1>
          <p>Kecantikan yang membuatmu percaya diri setiap hari.</p>
          <a href="#produk">
            <button className="btn-jelajahi">Jelajahi Sekarang</button>
          </a>
        </div>
      </section>

      {/* Produk */}
      <section id="produk" className="produk-section">
        <h2>Produk Unggulan</h2>
        <p className="produk-desc">Temukan produk kecantikan favorit Anda di sini!</p>
        <div className="produk-cards">
          {[
            { nama: "SKN", harga: "Rp45.000" },
            { nama: "MKP", harga: "Rp65.000" },
            { nama: "HRC", harga: "Rp55.000" }
          ].map((produk, index) => (
            <div className="produk-card" key={index}>
              <img
                src="https://i.pinimg.com/736x/13/14/6c/13146c62bf5a9b75a9c2fe21cc90635c.jpg"
                alt={produk.nama}
              />
              <h3>{produk.nama}</h3>
              <p>{produk.harga}</p>
              <div className="produk-buttons">
                <button className="btn-keranjang">+ Keranjang</button>
                <button className="btn-beli">Beli</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimoni */}
      <section id="testimoni" className="testimoni-section">
        <h2>Testimoni Pelanggan</h2>
        <div className="testimoni-cards">
          {[
            {
              nama: "Ayu",
              ulasan: "Produk bagus banget! Kulitku jadi lebih sehat.",
              rating: 5,
              foto: "https://randomuser.me/api/portraits/women/1.jpg"
            },
            {
              nama: "Sari",
              ulasan: "Pelayanan cepat dan ramah, suka banget!",
              rating: 4,
              foto: "https://randomuser.me/api/portraits/women/2.jpg"
            }
          ].map((item, index) => (
            <div className="testimoni-card" key={index}>
              <img src={item.foto} alt={item.nama} className="testimoni-foto" />
              <div className="testimoni-info">
                <div className="testimoni-header">{item.nama}</div>
                <div className="testimoni-pesan">"{item.ulasan}"</div>
                <div className="testimoni-rating">
                  {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-jelajahi" onClick={() => navigate("/form-testimoni")}>
          Tambah Testimoni
        </button>
      </section>

      {/* Artikel */}
      <section id="artikel" className="artikel-section">
        <h2>Artikel Kecantikan</h2>
        <div className="artikel-cards">
          <div className="artikel-card">
            <h3>Tips Makeup Natural</h3>
            <p>Cara tampil natural tapi tetap memukau setiap hari.</p>
          </div>
          <div className="artikel-card">
            <h3>Rutinitas Skincare Pagi</h3>
            <p>Langkah-langkah merawat kulit wajah di pagi hari.</p>
          </div>
        </div>
      </section>

      {/* Kontak */}
      <section className="contact-section" id="kontak">
        <h3>Hubungi Kami</h3>
        <div className="contact-container">
          <form className="contact-form">
            <input type="text" placeholder="Nama" />
            <input type="email" placeholder="Email" />
            <textarea rows="4" placeholder="Pesan" />
            <button type="submit">Kirim</button>
          </form>

          <div className="contact-info">
            <p>Atau langsung hubungi kami via:</p>

            {/* WhatsApp */}
            <a
              href="https://wa.me/6281234567890"
              className="btn-whatsapp-icon"
              target="_blank"
              rel="noopener noreferrer"
              title="Hubungi kami via WhatsApp"
            >
              <img src="/images/wa.png" alt="WhatsApp" style={{ width: "40px", marginRight: "10px" }} />
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/istanacosmetic"
              className="btn-instagram-icon"
              target="_blank"
              rel="noopener noreferrer"
              title="Kunjungi Instagram kami"
            >
              <img src="/images/ig.png" alt="Instagram" style={{ width: "40px" }} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Istana Cosmetic. Cantik itu pilihan, percaya diri itu kekuatan.</p>
      </footer>
    </div>
  );
}
