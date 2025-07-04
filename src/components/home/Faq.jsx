
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { supabase } from "../../supabase"; // Pastikan path benar
import { ChevronDown, ChevronUp } from "lucide-react";

import { useState, useEffect } from "react";
import { supabase } from "../../supabase";


export default function FAQ({ withLayout = false }) {
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

  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchFAQ = async () => {
      const { data, error } = await supabase
        .from("faq")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error) setFaqList(data);
    };

    fetchFAQ();
  }, []);

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
        <h2 style={{ fontSize: 28, color: warnaUtama, fontWeight: "bold", marginBottom: 20 }}>
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

        {displayedFAQ.map((item, index) => {
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

                onClick={() => setOpenIndex(isOpen ? null : index)}
                style={{
                  padding: "16px 20px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h4 style={{ margin: 0, fontSize: 16, color: warnaUtama }}>{item.pertanyaan}</h4>
                <div
                  style={{
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "0.3s",
                    fontSize: 20,
                    color: warnaUtama,
                  }}
                >
                  +
                </div>
              </div>
              {isOpen && (
                <div style={{ padding: "0 20px 16px", fontSize: 14, color: "#444" }}>
                  {item.jawaban}
                </div>
              )}
            </div>
          );
        })}

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

      {/* Gambar Samping */}
      <div style={{ flex: "1 1 300px", textAlign: "center", maxWidth: 400 }}>

        <img
          src="/images/1png.png"
          alt="Ilustrasi FAQ"
          style={{ width: "100%", maxWidth: 350, borderRadius: 12 }}
        />
      </div>
    </section>
  );

  return content;
}
