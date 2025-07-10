// src/pages/FormTestimoniDariPesanan.jsx
import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../supabase";
import FormTestimoniPopup from "./FormTestimoniPopup";
import { Sparkles, PencilLine, Search } from "lucide-react";

const FormTestimoniDariPesanan = () => {
  const [pesananSelesai, setPesananSelesai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPesanan, setSelectedPesanan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPesanan = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from("pesanan")
        .select(`
          id_pesanan, total_harga, tanggal_pesanan, status,
          produk (name, image)
        `)
        .eq("id_user", userId)
        .eq("status", "Selesai")
        .order("created_at", { ascending: false });

      if (!error) setPesananSelesai(data);
      setLoading(false);
    };

    fetchPesanan();
  }, []);

  const filteredPesanan = useMemo(() => {
    return pesananSelesai.filter((item) =>
      item.produk?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pesananSelesai, searchTerm]);

  return (
    <div className="min-h-screen bg-orange-50">
      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 pb-20 pt-16 text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-12 h-12 text-orange-200 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold mb-3">Tulis Testimoni</h1>
          <p className="text-lg text-orange-100">
            Berikan pendapatmu tentang produk yang sudah kamu beli 🧡
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="url(#gradient1)"
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,165,0,0.3)" />
                <stop offset="100%" stopColor="rgba(255,255,255,1)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

     

      {/* LIST PRODUK */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-center text-gray-600">Memuat data pesanan...</p>
        ) : filteredPesanan.length === 0 ? (
          <p className="text-center text-orange-600 font-semibold mt-10">
            Tidak ada produk yang cocok.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPesanan.map((pesanan) => (
              <div
                key={pesanan.id_pesanan}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-xl transition"
              >
                <img
                  src={pesanan.produk?.image || "/fallback.jpg"}
                  alt={pesanan.produk?.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-sm font-semibold text-orange-800 mb-2 line-clamp-2 text-center">
                    {pesanan.produk?.name}
                  </h2>
                  <p className="text-xs text-gray-600 text-center mb-4">
                    Total: Rp{Number(pesanan.total_harga).toLocaleString("id-ID")}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedPesanan(pesanan);
                      setShowForm(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white text-sm px-3 py-2 rounded-md hover:bg-orange-700 transition"
                  >
                    <PencilLine className="w-4 h-4" />
                    Tulis Testimoni
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FORM TESTIMONI */}
      <FormTestimoniPopup
        show={showForm}
        onClose={() => setShowForm(false)}
        pesanan={selectedPesanan}
      />
    </div>
  );
};

export default FormTestimoniDariPesanan;
