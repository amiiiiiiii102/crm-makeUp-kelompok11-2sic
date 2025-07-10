import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabase";
import { BookOpen, Sparkles, Search } from "lucide-react";

const DaftarArtikel = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 pb-20 pt-16 text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-12 h-12 text-orange-200 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold mb-3">Daftar Artikel</h1>
          <p className="text-lg text-orange-100">
            Temukan informasi dan tips kecantikan terkini dari kami
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

      {/* SEARCH BAR */}
<div className="max-w-4xl mx-auto px-6 z-10 relative mt-10">

        <div className="bg-white p-5 rounded-3xl shadow-xl border border-orange-200">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset ke page 1 kalau search berubah
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
                <img
                  src={artikel.thumbnailartikel || "/fallback.jpg"}
                  alt="Thumbnail"
                  className="w-full h-48 object-cover"
                  onError={(e) => (e.target.src = "/fallback.jpg")}
                />
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-orange-800 mb-2 line-clamp-2">
                    {artikel.judulartikel}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {artikel.isiartikel}
                  </p>
                  <button
                    className="text-sm font-semibold text-orange-600 hover:underline"
                    onClick={() => alert(artikel.isiartikel)}
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
    </div>
  );
};

export default DaftarArtikel;
