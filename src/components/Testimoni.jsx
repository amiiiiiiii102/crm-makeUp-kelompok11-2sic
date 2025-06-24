// src/pages/Testimoni.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Testimoni() {
  const data = [
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
  ];

  return (
    <div>
      <Navbar activeNav="testimoni" />
      <section id="testimoni" style={{ backgroundColor: "#ffffff", padding: "60px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, color: "#f37021", marginBottom: 20 }}>Testimoni Pelanggan</h2>
        <p style={{ marginBottom: 30 }}>Pendapat pelanggan tentang produk kami</p>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 24,
          marginTop: 30
        }}>
          {data.map((item, index) => (
            <div key={index} style={{
              width: 250,
              backgroundColor: "white",
              borderRadius: 12,
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              textAlign: "center",
              padding: 16,
              transition: "0.3s ease"
            }}>
              <img src={item.foto} alt="Produk" style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: 10,
                marginBottom: 12
              }} />
              <h4 style={{ color: "#f37021", fontWeight: 600, marginBottom: 8 }}>{item.nama}</h4>
              <p style={{ fontStyle: "italic", color: "#333333", fontSize: 14, marginBottom: 6 }}>"{item.ulasan}"</p>
              <div style={{ color: "gold", fontSize: 16 }}>
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
