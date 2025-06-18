import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import logo from "../assets/images/logo.png";
import Login from "../pages/auth/Login"

export default function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="header-title">Istana Cosmetic</h1>
        </div>
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#produk">Produk</a>
          <a href="#artikel">Artikel</a>
        </nav>
        <Link to="/login" className="button-primary">
  Login
</Link>


      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
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
      </section>

      {/* About Us */}
      <section className="section" id="about">
        <h2>Tentang Kami</h2>
        <p>
          Istana Cosmetic adalah platform kecantikan terpercaya yang menyediakan
          produk kosmetik berkualitas dari berbagai merek ternama. Kami hadir untuk
          mendukung penampilan dan kepercayaan dirimu setiap hari.
        </p>
      </section>

      {/* Produk */}
      <section className="section" id="produk">
        <h2>Produk Unggulan</h2>
        <div className="produk-grid">
          <div className="produk-card">
            <img src="/images/lipstick.jpg" alt="Lipstick" />
            <h3>Lipstick Matte</h3>
            <p>Warna tahan lama dan tidak membuat bibir kering.</p>
          </div>
          <div className="produk-card">
            <img src="/images/foundation.jpg" alt="Foundation" />
            <h3>Liquid Foundation</h3>
            <p>Memberikan coverage sempurna sepanjang hari.</p>
          </div>
          <div className="produk-card">
            <img src="/images/skincare.jpg" alt="Skincare" />
            <h3>Serum Wajah</h3>
            <p>Mencerahkan dan merawat kulit wajah secara alami.</p>
          </div>
        </div>
      </section>

      {/* Artikel */}
      <section className="section" id="artikel">
        <h2>Artikel Kecantikan</h2>
        <div className="artikel-grid">
          <div className="artikel-card">
            <h4>Tips Makeup Natural</h4>
            <p>Cara tampil fresh tanpa terlihat berlebihan.</p>
            <a href="#">Baca Selengkapnya</a>
          </div>
          <div className="artikel-card">
            <h4>Perawatan Kulit Berminyak</h4>
            <p>Rutin skincare untuk mengontrol minyak berlebih.</p>
            <a href="#">Baca Selengkapnya</a>
          </div>
          <div className="artikel-card">
            <h4>Manfaat Double Cleansing</h4>
            <p>Membersihkan wajah lebih maksimal dari kotoran & makeup.</p>
            <a href="#">Baca Selengkapnya</a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
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
