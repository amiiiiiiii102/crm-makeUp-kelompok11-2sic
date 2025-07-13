import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabase";
import { BookOpen, Sparkles, Search, X } from "lucide-react";

const DaftarArtikel = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArtikel, setSelectedArtikel] = useState(null);
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

    if (error) console.error("Gagal mengambil artikel:", error);
    else setArticles(data);
    setLoading(false);
  };

  const filteredArticles = useMemo(() => {
    return articles.filter((artikel) =>
      artikel.judulartikel.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [articles, searchTerm]);

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 pb-20 pt-16 text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <Sparkles className="w-12 h-12 text-orange-200 mx-auto mb-4 animate-pulse" />
          <h1 className="text-5xl font-bold mb-3">Daftar Artikel</h1>
          <p className="text-lg text-orange-100">
            Temukan informasi dan tips kecantikan terkini dari kami
          </p>
        </div>
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 120" fill="none">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H0Z"
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

      {/* Search Box */}
      <div className="max-w-4xl mx-auto px-6 relative mt-10">
        <div className="bg-white p-5 rounded-3xl shadow-xl border border-orange-200">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-orange-200 bg-orange-50 placeholder:text-orange-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>
      </div>

      {/* Artikel Grid */}
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
                className="bg-white rounded-xl border border-orange-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col"
              >
                <div className="bg-orange-50 border-b border-orange-100 p-3 flex items-center justify-center h-52">
                  <img
                    src={artikel.thumbnailartikel || "/fallback.jpg"}
                    alt="Thumbnail"
                    className="h-full object-contain rounded"
                    onError={(e) => (e.target.src = "/fallback.jpg")}
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-lg font-bold text-orange-800 mb-2 line-clamp-2">
                    {artikel.judulartikel}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {artikel.isiartikel}
                  </p>
                  <button
                    onClick={() => setSelectedArtikel(artikel)}
                    className="mt-auto inline-flex items-center text-sm text-orange-600 hover:text-orange-800 transition font-medium"
                  >
                    <BookOpen className="w-4 h-4 mr-1" />
                    Baca Selengkapnya
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
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

      {/* Modal Detail */}
      {selectedArtikel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedArtikel(null)}
              className="absolute top-3 right-3 text-orange-600 hover:text-orange-800"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-orange-700 mb-4">{selectedArtikel.judulartikel}</h2>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-5 max-w-md mx-auto">
              <img
                src={selectedArtikel.thumbnailartikel || "/fallback.jpg"}
                alt="Gambar Artikel"
                className="max-h-64 w-full object-contain rounded"
              />
            </div>

            <p className="text-gray-700 whitespace-pre-line">{selectedArtikel.isiartikel}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarArtikel;
