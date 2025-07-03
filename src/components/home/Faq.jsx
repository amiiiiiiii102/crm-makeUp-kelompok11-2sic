import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { supabase } from "../../supabase"; // Pastikan path benar
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ({ withLayout = true }) {
  const warnaUtama = "#b4380d";
  const [faqList, setFaqList] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  const fetchFaq = async () => {
    const { data, error } = await supabase
      .from("faq")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil FAQ:", error);
    } else {
      setFaqList(data || []);
    }
  };

  useEffect(() => {
    fetchFaq();
  }, []);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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

        {faqList.length === 0 ? (
          <p style={{ color: "#888" }}>Belum ada data FAQ tersedia.</p>
        ) : (
          faqList.map((faq, index) => (
            <div
              key={faq.id}
              onClick={() => toggle(index)}
              style={{
                backgroundColor: "#fff",
                marginBottom: 12,
                borderRadius: 12,
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                padding: "16px 20px",
                cursor: "pointer",
                transition: "0.3s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h4 style={{ color: warnaUtama, fontWeight: "bold", fontSize: 16 }}>
                  {faq.pertanyaan}
                </h4>
                {openIndex === index ? (
                  <ChevronUp size={18} color={warnaUtama} />
                ) : (
                  <ChevronDown size={18} color={warnaUtama} />
                )}
              </div>
              {openIndex === index && (
                <p style={{ marginTop: 10, color: "#333", fontSize: 14 }}>
                  {faq.jawaban}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Kanan: Ilustrasi Gambar */}
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
