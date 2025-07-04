import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate
import Navbar from "./Navbar";
import Footer from "./Footer";
import { supabase } from "../../supabase";

export default function Produk({ withLayout = true }) {
  const [produk, setProduk] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate(); // ✅ inisialisasi navigate
  const warnaUtama = "#b4380d";

  useEffect(() => {
    fetchProduk();
  }, []);

  const fetchProduk = async () => {
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data produk:", error);
    } else {
      setProduk(data || []);
    }
  };

  const produkToShow = showAll ? produk : produk.slice(0, 4);

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
      <h2
        style={{
          fontSize: 28,
          color: "#fff",
          marginBottom: 10,
          fontWeight: "bold",
        }}
      >
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

        {produkToShow.map((p, index) => {
          const hasDiscount = p.discount && p.discount > 0;
          const priceDisplay =
            hasDiscount && p.original_price
              ? `Rp${Number(p.original_price).toLocaleString("id-ID")} - Rp${Number(p.price).toLocaleString("id-ID")}`
              : `Rp${Number(p.price).toLocaleString("id-ID")}`;

          return (

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
              key={index}
              style={{

                position: "relative",
                backgroundColor: "#ffffff",
                borderRadius: 16,
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                padding: 16,
                textAlign: "center",

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
              {hasDiscount && (
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
                  -{p.discount}%
                </div>
              )}
              <img
                src={p.image && p.image.startsWith("http") ? p.image : "/fallback.png"}
                alt={p.name}
                style={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  borderRadius: 12,
                  marginBottom: 10,
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/fallback.png";
                }}
              />
              <button
  onClick={() => {
    const session = supabase.auth.getSession(); // kalau pakai Supabase Auth
    session.then(({ data: { session } }) => {
      if (session) {
        navigate("/produkuser"); // atau jalankan proses pembelian
      } else {
        navigate("/login");
      }
    });
  }}
  style={{
    backgroundColor: warnaUtama,
    color: "white",
    fontWeight: 500,
    border: "none",
    padding: "10px 0",
    width: "100%",
    borderRadius: 20,
    marginBottom: 10,
    cursor: "pointer",
  }}
>
  🛍 Beli Sekarang
</button>

              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                {p.name}
              </h3>
              <p style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>
                {p.description}
              </p>
              <p
                style={{
                  color: warnaUtama,
                  fontWeight: "bold",
                  marginBottom: 6,
                }}
              >
                {priceDisplay}
              </p>
              <div style={{ color: "#b4380d", fontSize: 13 }}>
                <span style={{ color: "#ff9f43", marginRight: 4 }}>★</span>
                {p.rating ? p.rating.toFixed(1) : "Belum ada rating"}
              </div>
            </div>
          );
        })}
      </div>

      {produk.length > 4 && (
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
