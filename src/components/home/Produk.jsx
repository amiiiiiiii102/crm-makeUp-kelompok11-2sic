import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Produk({ withLayout = true }) {
  const allProduk = [
    {
      nama: "MEDIHEAL",
      deskripsi: "THE I.P.I Brightening Ampoule Mask",
      hargaMin: "Rp26.910",
      hargaMax: "Rp29.900",
      rating: 4.7,
      ulasan: "6,3k",
      diskon: "10%",
      gambar: "https://i.pinimg.com/736x/fc/23/f4/fc23f406db7394def1b894bad4e0e8b4.jpg",
    },
    {
      nama: "SOME BY MI",
      deskripsi: "AHA BHA PHA 30 Days Miracle Toner",
      hargaMin: "Rp89.000",
      hargaMax: "Rp99.000",
      rating: 4.8,
      ulasan: "12k",
      diskon: "15%",
      gambar: "https://images.tokopedia.net/img/cache/700/product-1/2019/12/27/5631210/5631210_f7652fdf-5cf7-4f24-b7ab-35c93f4d4f2e.jpg",
    },
    {
      nama: "SOMETHINC",
      deskripsi: "Niacinamide + Moisture Sabi Beet",
      hargaMin: "Rp79.000",
      hargaMax: "Rp88.000",
      rating: 4.6,
      ulasan: "9,8k",
      diskon: "12%",
      gambar: "https://images.tokopedia.net/img/cache/700/VqbcmM/2023/7/6/fc9db6f3-a0f7-4e0f-8044-028cf5d55c1f.jpg",
    },
    {
      nama: "Wardah",
      deskripsi: "Perfect Bright Creamy Foam",
      hargaMin: "Rp18.000",
      hargaMax: "Rp20.000",
      rating: 4.5,
      ulasan: "5,4k",
      diskon: "8%",
      gambar: "https://images.tokopedia.net/img/cache/700/product-1/2018/9/27/2419119/2419119_d82b31f0-9180-4f10-81db-5ecf2ef0918a_600_600.jpg",
    },
    {
      nama: "SKINTIFIC",
      deskripsi: "Barrier Repair Moisturizer Gel",
      hargaMin: "Rp105.000",
      hargaMax: "Rp120.000",
      rating: 4.9,
      ulasan: "14k",
      diskon: "20%",
      gambar: "https://images.tokopedia.net/img/cache/700/VqbcmM/2022/10/10/f9fbb59b-6232-46b6-9a17-23f16c3e1473.jpg",
    },
    {
      nama: "Emina",
      deskripsi: "Bright Stuff Face Wash 100ml",
      hargaMin: "Rp22.000",
      hargaMax: "Rp25.000",
      rating: 4.4,
      ulasan: "4,1k",
      diskon: "5%",
      gambar: "https://images.tokopedia.net/img/cache/700/product-1/2018/10/22/2419119/2419119_1ee35afc-f508-4b2b-813c-58dcf56e211d_700_700.jpg",
    },
  ];

  const [showAll, setShowAll] = useState(false);
  const produkToShow = showAll ? allProduk : allProduk.slice(0, 4);
  const warnaUtama = "#b4380d";

  const content = (
    <section
      id="produk"
      style={{
        minHeight: "100vh",
        padding: "60px 20px",
        backgroundColor: "#FFB347",
        color: "#333",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: 28, color: "#fff", marginBottom: 10, fontWeight: "bold" }}>
        Produk Unggulan
      </h2>
      <p style={{ marginBottom: 30, color: "#fff", fontWeight: "bold" }}>
        Temukan produk kecantikan favorit Anda di sini!
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 25,
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        {produkToShow.map((produk, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              backgroundColor: "#ffffff",
              borderRadius: 16,
              boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
              padding: 16,
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)";
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 10,
                left: -20,
                backgroundColor: warnaUtama,
                color: "white",
                fontSize: 12,
                fontWeight: "bold",
                padding: "4px 30px",
                transform: "rotate(-45deg)",
              }}
            >
              {produk.diskon}
            </div>
            <img
              src={produk.gambar}
              alt={produk.nama}
              style={{
                width: "100%",
                height: 160,
                objectFit: "cover",
                borderRadius: 12,
                marginBottom: 10,
              }}
            />
            <button
              style={{
                backgroundColor: warnaUtama,
                color: "white",
                fontWeight: 500,
                border: "none",
                padding: "10px 0",
                width: "100%",
                borderRadius: 30,
                marginBottom: 10,
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#932f0b")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = warnaUtama)
              }
            >
              🛍 Beli Sekarang
            </button>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{produk.nama}</h3>
            <p style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{produk.deskripsi}</p>
            <p style={{ color: warnaUtama, fontWeight: "bold", marginBottom: 6 }}>
              {produk.hargaMin} - {produk.hargaMax}
            </p>
            <div style={{ color: "#b4380d", fontSize: 13 }}>
              <span style={{ color: "#ff9f43", marginRight: 4 }}>★</span>
              {produk.rating} ({produk.ulasan})
            </div>
          </div>
        ))}
      </div>

      {allProduk.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            marginTop: 40,
            padding: "10px 24px",
            backgroundColor: warnaUtama,
            color: "white",
            border: "none",
            borderRadius: 30,
            fontWeight: 500,
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#932f0b")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = warnaUtama)
          }
        >
          {showAll ? "Sembunyikan" : "Lihat Lainnya"}
        </button>
      )}
    </section>
  );

  return withLayout ? (
    <>
      <Navbar activeNav="produk" />
      {content}
      <Footer />
    </>
  ) : (
    content
  );
}
