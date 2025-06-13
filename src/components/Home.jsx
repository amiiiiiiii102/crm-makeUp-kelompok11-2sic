import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";
import logo from "../assets/images/logo.png"; // impor gambar dengan benar

export default function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="logo" /> {/* gunakan variabel logo */}
          <h1 className="header-title">Istana Cosmetic</h1>
        </div>
        <div className="header-center">
          <nav className="nav-links">
            <a href="/">Home</a>
            <a href="#about">About Us</a>
            <a href="#produk">Produk</a>
            <a href="#artikel">Artikel</a>
          </nav>
          <button onClick={handleLogin} className="button-primary">
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero">
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
          <button onClick={handleLogin} className="button-primary">
            Jelajahi Sekarang
          </button>
        </motion.div>

        <motion.img
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          src="/images/hero-makeup.png"
          alt="Makeup Products"
        />
      </main>

      {/* Features */}
      <section className="features" id="produk">
        <div className="feature-item">
          <h3>Produk Asli</h3>
          <p>Jaminan produk 100% original dari brand terpercaya.</p>
        </div>
        <div className="feature-item">
          <h3>Pengiriman Cepat</h3>
          <p>Pesanan dikirim dalam waktu 1x24 jam ke seluruh Indonesia.</p>
        </div>
        <div className="feature-item">
          <h3>Promo Menarik</h3>
          <p>Nikmati diskon, cashback, dan bundling setiap hari.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        &copy; 2025 Istana Cosmetic. All rights reserved.
      </footer>
    </div>
  );
}
