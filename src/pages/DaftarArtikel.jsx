import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabase";
import { Search, Sparkles, X } from "lucide-react";

const DaftarArtikel = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [selectedArtikel, setSelectedArtikel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const articlesPerPage = 3;

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("artikel")
      .select("*")
      .eq("statusartikel", "publish")
      .order("created_at", { ascending: false });

    if (!error) setArticles(data);
    setLoading(false);
  };

  const filteredArticles = useMemo(() => {
    return articles
      .filter((artikel) =>
        kategori === "Semua" ? true : artikel.kategoriartikel === kategori
      )
      .filter((artikel) =>
        artikel.judulartikel.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [articles, searchTerm, kategori]);

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  const kategoriOptions = ["Semua", "Skincare", "Makeup", "Tips", "Review"];

  return (
    <div className="min-h-screen bg-orange-50">
      {/* HERO */}
      <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 pb-20 pt-16 text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-orange-200 animate-pulse" />
          <h1 className="text-5xl font-bold mb-3">Daftar Artikel</h1>
          <p className="text-lg text-orange-100">
            Temukan informasi dan tips kecantikan terkini dari kami
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="max-w-5xl mx-auto px-6 mt-10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl shadow-lg border border-orange-200">
          {/* Dropdown */}
          <select
            value={kategori}
            onChange={(e) => {
              setKategori(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-1/3 border-2 border-orange-200 bg-orange-50 text-orange-700 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            {kategoriOptions.map((option) => (
              <option key={option} value={option}>
                {option === "Semua" ? "Semua Kategori" : option}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50 text-gray-700 placeholder:text-orange-400"
            />
          </div>
        </div>
      </div>

      {/* ARTIKEL */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-center text-gray-600">Memuat artikel...</p>
        ) : currentArticles.length === 0 ? (
          <p className="text-center text-orange-600 font-semibold mt-10">
            Artikel tidak ditemukan.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentArticles.map((artikel) => (
              <div
                key={artikel.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-xl transition"
              >
                <div className="bg-white h-48 flex items-center justify-center border-b border-orange-100">
                  <img
                    src={artikel.thumbnailartikel || "/fallback.jpg"}
                    alt="Thumbnail"
                    className="max-h-44 object-contain"
                    onError={(e) => (e.target.src = "/fallback.jpg")}
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-orange-800 mb-2 line-clamp-2">
                    {artikel.judulartikel}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {artikel.isiartikel}
                  </p>
                  <button
                    className="text-sm font-semibold text-orange-600 hover:underline"
                    onClick={() => setSelectedArtikel(artikel)}
                  >
                    Baca Selengkapnya
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-full font-bold text-sm transition-all border
                  ${currentPage === index + 1
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-orange-600 border-orange-300 hover:bg-orange-50"}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedArtikel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedArtikel(null)}
              className="absolute top-3 right-3 text-orange-600 hover:text-orange-800"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-orange-700 mb-4">
              {selectedArtikel.judulartikel}
            </h2>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-5">
              <img
                src={selectedArtikel.thumbnailartikel || "/fallback.jpg"}
                alt="Gambar Artikel"
                className="max-h-64 mx-auto object-contain"
              />
            </div>
            <p className="text-gray-700 whitespace-pre-line">
              {selectedArtikel.isiartikel}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarArtikel;
