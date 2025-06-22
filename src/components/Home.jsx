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
      {
        nama: "MEDIHEAL",
        deskripsi: "THE I.P.I Brightening Ampoule Mask",
        hargaMin: "Rp26.910",
        hargaMax: "Rp29.900",
        rating: 4.7,
        ulasan: "6,3k",
        diskon: "10%",
        gambar: "https://i.pinimg.com/736x/fc/23/f4/fc23f406db7394def1b894bad4e0e8b4.jpg"
      },
      {
        nama: "SOME BY MI",
        deskripsi: "AHA BHA PHA 30 Days Miracle Toner",
        hargaMin: "Rp89.000",
        hargaMax: "Rp99.000",
        rating: 4.8,
        ulasan: "12k",
        diskon: "15%",
        gambar: "https://images.tokopedia.net/img/cache/700/product-1/2019/12/27/5631210/5631210_f7652fdf-5cf7-4f24-b7ab-35c93f4d4f2e.jpg"
      }
      
    ].map((produk, index) => (
      <div className="produk-card-desain" key={index}>
        <div className="diskon-label">{produk.diskon}</div>
        <img src={produk.gambar} alt={produk.nama} className="produk-gambar" />
        <button className="btn-beli-desain">🛍 Beli Sekarang</button>
        <div className="produk-info">
          <h3>{produk.nama}</h3>
          <p className="produk-deskripsi">{produk.deskripsi}</p>
          <p className="produk-harga">
            {produk.hargaMin} - {produk.hargaMax}
          </p>
          <div className="produk-rating">
            <span className="bintang">★</span>
            {produk.rating} ({produk.ulasan})
          </div>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* Testimoni */}
     <section id="testimoni" className="testimoni-section">
  <h2>Testimoni Pelanggan</h2>
  <p className="produk-desc">Pendapat pelanggan tentang produk kami</p>

  <div className="testimoni-cards-custom">
    {[
      {
        nama: "Ayu Lestari",
        ulasan: "Setelah pakai 2 minggu, kulitku jauh lebih cerah dan lembab!",
        rating: 5,
        foto: "https://i.pinimg.com/736x/e5/e1/26/e5e126dde6ef832a68dd6a04e740309d.jpg",
      },
      {
        nama: "Rina Aprilia",
        ulasan: "Teksturnya ringan, cepat menyerap dan bikin glowing. Love it!",
        rating: 4,
        foto: "https://i.pinimg.com/736x/e5/e1/26/e5e126dde6ef832a68dd6a04e740309d.jpg",
      },
      {
        nama: "Dewi Anggraini",
        ulasan: "Warna dan hasilnya sesuai dengan ekspektasi, recommended!",
        rating: 5,
        foto: "https://i.pinimg.com/736x/e5/e1/26/e5e126dde6ef832a68dd6a04e740309d.jpg",
      }
    ].map((item, index) => (
      <div className="testimoni-card-custom" key={index}>
        <img src={item.foto} alt="Produk" className="testimoni-foto-produk" />
        <div className="testimoni-isi">
          <h4 className="testimoni-nama">{item.nama}</h4>
          <p className="testimoni-ulasan">"{item.ulasan}"</p>
          <div className="testimoni-rating">
            {"★".repeat(item.rating)}
            {"☆".repeat(5 - item.rating)}
          </div>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* Artikel */}
<section id="artikel" className="artikel-section">
  <h2>Artikel Kecantikan</h2>
  <p className="produk-desc">Tips & info seputar perawatan kulit dan kecantikan</p>
  <div className="artikel-cards-custom">
    {[
      {
        judul: "Tips Makeup Natural Sehari-hari",
        isi: "Pelajari cara tampil cantik natural tanpa terlihat berlebihan.",
        gambar: "https://i.pinimg.com/736x/fc/23/f4/fc23f406db7394def1b894bad4e0e8b4.jpg"
      },
      {
        judul: "Skincare Rutin untuk Remaja",
        isi: "Panduan skincare sederhana tapi efektif buat kulit remaja.",
        gambar: "https://i.pinimg.com/736x/aa/d2/ed/aad2eda7ab5cc54a0a988a4cef0f917d.jpg"
      }
    ].map((artikel, index) => (
      <div className="artikel-card-custom" key={index}>
        <img src={artikel.gambar} alt={artikel.judul} className="artikel-thumbnail" />
        <div className="artikel-isi">
          <h3 className="artikel-judul">{artikel.judul}</h3>
          <p className="artikel-teks">{artikel.isi}</p>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* Kontak */}
      <section className="contact-section" id="kontak">
        <h3>Hubungi Kami</h3>
        <div className="contact-container">


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
