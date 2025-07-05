import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FormTestimoni from "../../pages/FormTestimoni";

export default function Testimoni({ withLayout = true }) {
  const [list, setList] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const warnaUtama = "#b4380d";

  const fetchTestimoni = async () => {
    const { data, error } = await supabase
      .from("testimoni")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      const updatedData = data.map((item) => {
        const { data: publicUrl } = supabase
          .storage
          .from("testimoni-foto")
          .getPublicUrl(item.foto); // item.foto = nama file

        return {
          ...item,
          foto: publicUrl?.publicUrl ?? "", // ubah jadi URL lengkap
        };
      });

      setList(updatedData);
    }
  };

  useEffect(() => {
    fetchTestimoni();
  }, []);

  const displayList = showAll ? list : list.slice(0, 4);

  const content = (
    <section
      id="testimoni"
      style={{
        backgroundColor: "#fff6ea",
        padding: "60px 20px",
        textAlign: "center",
        transition: "all 0.3s ease-in-out",
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
        {displayList.map((item, index) => (
          <div
            key={index}
            style={{
              width: 250,
              backgroundColor: "white",
              borderRadius: 16,
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              padding: 16,
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <img
              src={item.foto}
              alt={item.nama}
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: 10,
                marginBottom: 12,
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/250x180?text=No+Image";
              }}
            />
            <h4 style={{ color: warnaUtama, fontWeight: 600 }}>{item.nama}</h4>
            <p style={{ fontSize: 14, color: "#333", fontStyle: "italic" }}>
              "{item.ulasan}"
            </p>
          </div>
        ))}
      </div>

      {/* Tombol aksi */}
      <div style={{ marginTop: 40, display: "flex", gap: 12, justifyContent: "center" }}>
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
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#932f0b")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = warnaUtama)
            }
          >
            {showAll ? "Sembunyikan" : "Lihat Testimoni Lainnya"}
          </button>
        )}

        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "10px 24px",
            backgroundColor: "#f37021",
            color: "#fff",
            border: "none",
            borderRadius: 30,
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#d65d12")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#f37021")
          }
        >
          Tambah Testimoni ✍️
        </button>
      </div>

      {/* Modal Form Testimoni */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 30,
              width: "90%",
              maxWidth: 500,
              position: "relative",
              animation: "fadeIn 0.4s ease-in-out",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "#ccc",
                border: "none",
                borderRadius: "50%",
                width: 30,
                height: 30,
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ✕
            </button>
            <FormTestimoni
              onSuccess={() => {
                setShowModal(false);
                fetchTestimoni(); // refresh data setelah submit
              }}
            />
          </div>
        </div>
      )}
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
