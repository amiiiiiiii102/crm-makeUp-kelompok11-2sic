import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  // Scroll animation logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".animated-section");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          section.classList.add("show");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/image/logo.png" alt="Logo" className="logo" />
          <div className="shop-name">Istana Cosmetic</div>
        </div>
        <div className="navbar-center">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#produk">Produk</a>
          <a href="#artikel">Artikel</a>
          <a href="#kontak">Kontak</a>
        </div>
        <div className="navbar-right">
          <Link to="/login" className="button-primary">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2>Tampil Cantik, Percaya Diri Setiap Hari</h2>
          <p>
            Temukan koleksi kosmetik terbaik dari brand ternama hanya di aplikasi
            Istana Cosmetic. Belanja mudah, cepat, dan aman.
          </p>
          <a href="#produk" className="button-primary">
            Jelajahi Sekarang
          </a>
        </motion.div>
      </section>

      {/* Produk Section */}
      <section id="produk" className="produk-section animated-section">
        <h2>Produk Unggulan</h2>
        <p className="produk-desc">
          Temukan produk kecantikan favorit Anda di sini!
        </p>
        <div className="produk-cards">
          {[
            { nama: "SKN", harga: "Rp45.000" },
            { nama: "MKP", harga: "Rp65.000" },
            { nama: "HRC", harga: "Rp55.000" },
          ].map((produk, index) => (
            <div className="produk-card" key={index}>
              <img
                src="https://i.pinimg.com/736x/13/14/6c/13146c62bf5a9b75a9c2fe21cc90635c.jpg"
                alt={produk.nama}
              />
              <h3>{produk.nama}</h3>
              <p className="produk-harga">{produk.harga}</p>
              <div className="produk-buttons">
                <button className="btn-keranjang">Tambah ke Keranjang</button>
                <button className="btn-beli">Beli Sekarang</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Artikel Section */}
      <section id="artikel" className="artikel-section animated-section">
        <h2>Artikel Kecantikan</h2>
        <div className="artikel-cards">
          <div className="artikel-card">
            <h3>Tips Makeup Natural</h3>
            <p>Pelajari cara tampil natural namun tetap memukau setiap hari.</p>
          </div>
          <div className="artikel-card">
            <h3>Rutinitas Skincare Pagi</h3>
            <p>Langkah-langkah merawat kulit wajah di pagi hari.</p>
          </div>
        </div>
      </section>

      {/* Kontak Section */}
      <section id="kontak" className="contact-section animated-section">
        <h2>Hubungi Kami</h2>
        <p>Untuk pertanyaan dan informasi lebih lanjut, hubungi kami via WhatsApp.</p>
        <a
          href="https://wa.me/62895393079282?text=Halo%20admin%20Istana%20Cosmetic%2C%20saya%20ingin%20bertanya..."
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
        >
          Chat via WhatsApp
        </a>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Istana Cosmetic. Cantik itu pilihan, percaya diri itu kekuatan.</p>
      </footer>
    </div>
  );
};

export default Home;
