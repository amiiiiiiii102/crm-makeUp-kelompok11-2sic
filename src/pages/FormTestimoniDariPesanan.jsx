import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../supabase";
import FormTestimoniPopup from "./FormTestimoniPopup";
import { Sparkles, PencilLine } from "lucide-react";

const FormTestimoniDariPesanan = () => {
  const [pesananSelesai, setPesananSelesai] = useState([]);
  const [testimoni, setTestimoni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPesanan, setSelectedPesanan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      const { data: pesananData } = await supabase
        .from("pesanan")
        .select(`
          id_pesanan, total_harga, tanggal_pesanan, status,
          produk (name, image)
        `)
        .eq("id_user", userId)
        .eq("status", "Selesai")
        .order("created_at", { ascending: false });

      const { data: testimoniData } = await supabase
        .from("testimoni")
        .select("id_pesanan")
        .eq("id_user", userId);

      setPesananSelesai(pesananData || []);
      setTestimoni(testimoniData?.map(t => t.id_pesanan) || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredPesanan = useMemo(() => {
    return pesananSelesai.filter((item) =>
      item.produk?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pesananSelesai, searchTerm]);

  return (
    <div className="min-h-screen bg-orange-50">
      {/* HEADER */}
      <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 pb-20 pt-16 text-white text-center">
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <Sparkles className="w-12 h-12 text-orange-200 mx-auto mb-4 animate-pulse" />
          <h1 className="text-5xl font-bold">Tulis Testimoni</h1>
          <p className="text-lg text-orange-100 mt-2">
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
                <stop offset="100%" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* TABLE PESANAN */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-center text-gray-600">Memuat data pesanan...</p>
        ) : filteredPesanan.length === 0 ? (
          <p className="text-center text-orange-600 font-semibold mt-10">
            Tidak ada produk yang cocok.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow bg-white border border-orange-100">
            <table className="min-w-full divide-y divide-orange-100 text-sm">
              <thead className="bg-orange-100 text-orange-700">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Produk</th>
                  <th className="px-6 py-3">Gambar</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50">
                {filteredPesanan.map((pesanan) => {
                  const sudahDikirim = testimoni.includes(pesanan.id_pesanan);
                  return (
                    <tr key={pesanan.id_pesanan} className="hover:bg-orange-50">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {pesanan.produk?.name}
                      </td>
                      <td className="px-6 py-4">
                        <img
                          src={pesanan.produk?.image || "/fallback.jpg"}
                          alt={pesanan.produk?.name}
                          className="w-16 h-16 object-cover rounded shadow"
                        />
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        Rp{Number(pesanan.total_harga).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(pesanan.tanggal_pesanan).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedPesanan(pesanan);
                            setShowForm(true);
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded text-white text-sm font-medium transition ${
                            sudahDikirim
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-orange-600 hover:bg-orange-700"
                          }`}
                          disabled={sudahDikirim}
                        >
                          <PencilLine className="w-4 h-4" />
                          {sudahDikirim ? "Sudah Dikirim" : "Tulis Testimoni"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FORM TESTIMONI POPUP */}
      <FormTestimoniPopup
        show={showForm}
        onClose={() => setShowForm(false)}
        pesanan={selectedPesanan}
      />
    </div>
  );
};

export default FormTestimoniDariPesanan;
