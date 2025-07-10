import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Star } from "lucide-react";

export default function Testimoni({ withLayout = true }) {
  const [list, setList] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const warnaUtama = "#b4380d";

  const fetchTestimoni = async () => {
    const { data, error } = await supabase
      .from("testimoni")
      .select(`
        id, ulasan, foto, rating, created_at,
        id_user ( email ),
        id_pesanan (
          produk ( name, image )
        )
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const updatedData = data.map((item) => {
        const { data: publicUrl } = supabase
          .storage
          .from("testimoni-foto")
          .getPublicUrl(item.foto);

        return {
          ...item,
          fotoUser: publicUrl?.publicUrl ?? "",
          namaUser: item.id_user?.email?.split("@")[0] ?? "Anonim",
          namaProduk: item.id_pesanan?.produk?.name ?? "Produk tidak ditemukan",
          fotoProduk: item.id_pesanan?.produk?.image ?? "",
          isExpanded: false,
        };
      });

      setList(updatedData);
    }
  };

  useEffect(() => {
    fetchTestimoni();
  }, []);

  const toggleUlasan = (index) => {
    const updatedList = [...list];
    updatedList[index].isExpanded = !updatedList[index].isExpanded;
    setList(updatedList);
  };

  const displayList = showAll ? list : list.slice(0, 4);

  const content = (
    <section
      id="testimoni"
      style={{
        backgroundColor: "#fff6ea",
        padding: "60px 20px",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: 28, color: warnaUtama, marginBottom: 20 }}>
        Testimoni Pelanggan
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {displayList.map((item, index) => {
          const isLong = item.ulasan.length > 100;
          const ulasanDisplayed = item.isExpanded
            ? item.ulasan
            : item.ulasan.slice(0, 100);

          return (
            <div
              key={index}
              style={{
                width: 290,
                backgroundColor: "#ffffff",
                borderRadius: 16,
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "transform 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {/* Foto Produk */}
              <img
                src={item.fotoProduk || "https://via.placeholder.com/250x180?text=No+Image"}
                alt={item.namaProduk}
                style={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  borderRadius: 12,
                  marginBottom: 10,
                }}
              />

              {/* Rating */}
              <div style={{ marginBottom: 6 }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`inline-block ${
                      i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Ulasan */}
              <p
                style={{
                  fontSize: 14,
                  color: "#555",
                  fontStyle: "italic",
                  marginBottom: 6,
                }}
              >
                "{ulasanDisplayed}"
                {isLong && !item.isExpanded && "…"}
              </p>

              {/* Button Baca Selengkapnya */}
              {isLong && (
                <button
                  onClick={() => toggleUlasan(index)}
                  style={{
                    fontSize: 12,
                    color: warnaUtama,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontStyle: "italic",
                    marginBottom: 6,
                  }}
                >
                  {item.isExpanded ? "Tutup" : "Baca Selengkapnya"}
                </button>
              )}

              {/* Foto dari User */}
              {item.isExpanded && item.fotoUser && (
                <img
                  src={item.fotoUser}
                  alt="Foto dari user"
                  style={{
                    width: "100%",
                    height: 140,
                    objectFit: "cover",
                    borderRadius: 12,
                    marginTop: 8,
                    border: "1px solid #f37021",
                  }}
                />
              )}

              {/* Nama Produk */}
              <h4 style={{ color: warnaUtama, fontWeight: 600, marginTop: 10 }}>
                {item.namaProduk}
              </h4>

              {/* Nama User */}
              <p style={{ fontSize: 12, color: "#888" }}>~ {item.namaUser}</p>
            </div>
          );
        })}
      </div>

      {/* Tombol Aksi */}
      <div style={{ marginTop: 40 }}>
        {list.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              padding: "10px 24px",
              backgroundColor: warnaUtama,
              color: "#fff",
              border: "none",
              borderRadius: 30,
              cursor: "pointer",
              fontWeight: "bold",
              transition: "all 0.3s ease",
            }}
          >
            {showAll ? "Sembunyikan" : "Lihat Testimoni Lainnya"}
          </button>
        )}
      </div>
    </section>
  );

  return withLayout ? (
    <>
      <Navbar activeNav="testimoni" />
      {content}
      <Footer />
    </>
  ) : (
    content
  );
}
