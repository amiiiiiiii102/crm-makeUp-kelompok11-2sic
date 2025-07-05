import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function FAQ({ withLayout = true }) {
  const warnaUtama = "#b4380d";
  const [faqList, setFaqList] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchFAQ = async () => {
      const { data, error } = await supabase
        .from("faq")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error) setFaqList(data);
      else console.error("Gagal mengambil FAQ:", error);
    };

    fetchFAQ();
  }, []);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const displayedFAQ = showAll ? faqList : faqList.slice(0, 5);

  const content = (
    <section
      id="faq"
      style={{
        padding: "60px 20px",
        backgroundColor: "#fff6ea",
        display: "flex",
        flexWrap: "wrap",
        gap: 40,
        justifyContent: "center",
      }}
    >
      {/* Kiri: Pertanyaan dari database Supabase */}
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

        {displayedFAQ.length === 0 ? (
          <p style={{ color: "#888" }}>Belum ada data FAQ tersedia.</p>
        ) : (
          displayedFAQ.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: "#fff",
                  marginBottom: 16,
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                  overflow: "hidden",
                  transition: "0.3s ease",
                }}
              >
                <div
                  onClick={() => toggle(index)}
                  style={{
                    padding: "16px 20px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      fontSize: 16,
                      color: warnaUtama,
                      fontWeight: "bold",
                    }}
                  >
                    {item.pertanyaan}
                  </h4>
                  {isOpen ? (
                    <ChevronUp size={18} color={warnaUtama} />
                  ) : (
                    <ChevronDown size={18} color={warnaUtama} />
                  )}
                </div>
                {isOpen && (
                  <div
                    style={{
                      padding: "0 20px 16px",
                      fontSize: 14,
                      color: "#444",
                    }}
                  >
                    {item.jawaban}
                  </div>
                )}
              </div>
            );
          })
        )}

        {faqList.length > 5 && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                backgroundColor: warnaUtama,
                color: "#fff",
                padding: "10px 20px",
                borderRadius: 20,
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {showAll ? "Sembunyikan" : "Lihat Semua"}
            </button>
          </div>
        )}
      </div>

      {/* Kanan: Gambar ilustrasi */}
      <div style={{ flex: "1 1 300px", textAlign: "center", maxWidth: 400 }}>
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
      <Navbar />
      {content}
      <Footer />
    </>
  ) : (
    content
  );
}
