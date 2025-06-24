import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Artikel() {
  const warnaUtama = "#b4380d";

  const allArtikel = [
    {
      judul: "Tips Makeup Natural Sehari-hari",
      isi: "Pelajari cara tampil cantik natural tanpa terlihat berlebihan. Cukup gunakan BB cream, sedikit blush, dan lip tint untuk hasil glowing. Hindari foundation tebal agar wajah tetap ringan. Tambahkan alis natural dan maskara untuk mempertegas mata tanpa kesan berat.",
      gambar: "https://i.pinimg.com/736x/fc/23/f4/fc23f406db7394def1b894bad4e0e8b4.jpg"
    },
    {
      judul: "Skincare Rutin untuk Remaja",
      isi: "Panduan skincare sederhana tapi efektif buat kulit remaja. Mulai dari facial wash, toner lembut, moisturizer ringan, dan sunscreen SPF 30. Hindari over-exfoliating dan pastikan tidur cukup untuk menjaga kesehatan kulit.",
      gambar: "https://i.pinimg.com/736x/aa/d2/ed/aad2eda7ab5cc54a0a988a4cef0f917d.jpg"
    },
    {
      judul: "Makeup Tahan Lama Saat Kondangan",
      isi: "Tips menjaga makeup agar tetap flawless saat acara seharian: gunakan primer, foundation matte,Tips menjaga makeup agar tetap flawless saat acara seharian: gunakan primer, foundation matte,Tips menjaga makeup agar tetap flawless saat acara seharian: gunakan primer, foundation matte,Tips menjaga makeup agar tetap flawless saat acara seharian: gunakan primer, foundation matte,Tips menjaga makeup agar tetap flawless saat acara seharian: gunakan primer, foundation matte,Tips menjaga makeup agar tetap flawless saat acara seharian: gunakan primer, foundation matte,Tips menjaga makeup agar tetap flawless saat acara seharian: gunakan primer, foundation matte,Tips menjaga makeup agar tetap flawless saat acara seharian: gunakan primer, foundation matte,Tips menjaga makeup agar tetap flawless saat acara seharian: gunakan primer, foundation matte,Tips menjaga makeup agar tetap flawless saat acara seharian: gunakan primer, foundation matte,Tips menjaga makeup agar tetap flawless saat acara seharian: gunakan primer, foundation matte,Tips menjaga makeup agar tetap flawless saat acara seharian: gunakan primer, foundation matte,Tips menjaga makeup agar tetap flawless saat acara seharian: gunakan primer, foundation matte,Tips menjaga makeup agar tetap flawless saat acara seharian: gunakan primer, foundation matte,Tips menjaga makeup agar tetap flawless saat acara seharian: gunakan primer, foundation matte,Tips menjaga makeup agar tetap flawless saat acara seharian: gunakan primer, foundation matte, dan setting spray. Jangan lupa bawa blotting paper dan lipstik untuk touch-up.",
      gambar: "https://i.pinimg.com/736x/f1/09/ed/f109edc0578a94d01dfe3de87f0a65ce.jpg"
    }
  ];

  const [showAll, setShowAll] = useState(false);
  const [selectedArtikel, setSelectedArtikel] = useState(null);

  const artikelToShow = showAll ? allArtikel : allArtikel.slice(0, 2);

  return (
    <div>
      <Navbar activeNav="artikel" />

      <section
        id="artikel"
        style={{
          backgroundColor: "#FFB347",
          padding: "60px 20px",
          textAlign: "center",
          minHeight: "100vh",
          color: "#fff"
        }}
      >
        <h2 style={{ fontSize: 28, color: "#fff", fontWeight: "bold", marginBottom: 10 }}>
          Artikel Kecantikan
        </h2>
        <p style={{ marginBottom: 30, color: "#fff", fontWeight: "bold" }}>
          Tips & info seputar perawatan kulit dan kecantikan
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 25,
            maxWidth: 1000,
            margin: "0 auto"
          }}
        >
          {artikelToShow.map((artikel, index) => (
            <div
              key={index}
              onClick={() => setSelectedArtikel(artikel)}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 14,
                boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
                overflow: "hidden",
                width: 280,
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "transform 0.3s ease"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <img
                src={artikel.gambar}
                alt={artikel.judul}
                style={{ width: "100%", height: 160, objectFit: "cover" }}
              />
              <div style={{ padding: 16 }}>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: warnaUtama,
                    marginBottom: 8
                  }}
                >
                  {artikel.judul}
                </h3>
                <p style={{ fontSize: 14, color: "#444", lineHeight: 1.5 }}>
                  {artikel.isi.substring(0, 60)}...
                </p>
              </div>
            </div>
          ))}
        </div>

        {allArtikel.length > 2 && (
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
              cursor: "pointer"
            }}
          >
            {showAll ? "Sembunyikan" : "Lihat Lainnya"}
          </button>
        )}

        {/* Modal Artikel */}
        {selectedArtikel && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999
            }}
            onClick={() => setSelectedArtikel(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 24,
                maxWidth: 600,
                maxHeight: "80vh",
                overflowY: "auto",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
              }}
            >
              <h2 style={{ color: warnaUtama }}>{selectedArtikel.judul}</h2>
              <img
                src={selectedArtikel.gambar}
                alt={selectedArtikel.judul}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  margin: "12px 0",
                  borderRadius: 10
                }}
              />
              <p style={{ color: "#333", lineHeight: 1.6 }}>
                {selectedArtikel.isi}
              </p>
              <button
                onClick={() => setSelectedArtikel(null)}
                style={{
                  marginTop: 20,
                  padding: "8px 20px",
                  backgroundColor: warnaUtama,
                  color: "#fff",
                  border: "none",
                  borderRadius: 20,
                  cursor: "pointer"
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
