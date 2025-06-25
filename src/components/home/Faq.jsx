// src/components/home/FAQ.jsx
import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function FAQ({ withLayout = true }) {
  const warnaUtama = "#b4380d";

  const pertanyaan = [
    {
      q: "Apakah produk ini aman untuk semua jenis kulit?",
      a: "Ya, produk kami telah teruji dermatologis dan cocok untuk semua jenis kulit, termasuk kulit sensitif.",
    },
    {
      q: "Berapa lama pengiriman produk sampai?",
      a: "Waktu pengiriman rata-rata 2-5 hari kerja tergantung lokasi pengiriman.",
    },
    {
      q: "Apakah saya bisa mengembalikan produk jika rusak?",
      a: "Tentu, Anda bisa mengajukan pengembalian jika produk rusak atau tidak sesuai, maksimal 3 hari setelah diterima.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const content = (
    <section
      id="faq"
      style={{
        padding: "60px 20px",
        backgroundColor: "#fff6ea",
        minHeight: "100vh",
        display: "flex",
        flexWrap: "wrap",
        gap: 40,
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      {/* Kiri: Pertanyaan */}
      <div style={{ flex: "1 1 500px", maxWidth: 600 }}>
        <h2
          style={{
            fontSize: 28,
            color: warnaUtama,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          Pertanyaan Umum (FAQ)
        </h2>
        {pertanyaan.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#fff",
              marginBottom: 12,
              borderRadius: 12,
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              padding: "16px 20px",
              cursor: "pointer",
              transition: "0.3s ease",
            }}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <h4 style={{ color: warnaUtama, fontWeight: "bold", fontSize: 16 }}>
              {item.q}
            </h4>
            {openIndex === index && (
              <p style={{ marginTop: 10, color: "#333", fontSize: 14 }}>
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Kanan: Gambar */}
      <div
        style={{
          flex: "1 1 300px",
          textAlign: "center",
          maxWidth: 400,
        }}
      >
        <img
          src="/images/1png.png"
          alt="Ilustrasi FAQ"
          style={{ width: "100%", maxWidth: 350, borderRadius: 12 }}
        />
      </div>
    </section>
  );

  return withLayout ? (
    <>
      <Navbar activeNav="faq" />
      {content}
      <Footer />
    </>
  ) : (
    content
  );
}
