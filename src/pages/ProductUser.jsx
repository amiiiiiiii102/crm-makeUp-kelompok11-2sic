import React, { useState, useEffect, useMemo } from "react";
// Impor ikon dari Lucide React
import { Star, Search, Heart, ShoppingBag, Sparkles, Filter } from "lucide-react";
// Impor hook navigasi dari React Router DOM
import { useNavigate } from "react-router-dom";
// Impor instance Supabase client yang sudah dikonfigurasi
import { supabase } from "../supabase"; 

const ProductUser = () => {
  // State untuk menyimpan daftar produk
  const [products, setProducts] = useState([]);
  // State untuk menyimpan kata kunci pencarian
  const [searchTerm, setSearchTerm] = useState("");
  // State untuk menyimpan kategori yang dipilih
  const [selectedCategory, setSelectedCategory] = useState("all");
  // State untuk menyimpan kriteria pengurutan
  const [sortBy, setSortBy] = useState("newest");
  // State untuk menunjukkan apakah data sedang dimuat
  const [loading, setLoading] = useState(true); 
  // State untuk menyimpan pesan error jika terjadi
  const [error, setError] = useState(null); 
  // Hook untuk navigasi antar halaman
  const navigate = useNavigate();

  // useEffect untuk mengambil data produk saat komponen pertama kali dirender
  useEffect(() => {
    fetchProducts();
  }, []); // Array dependensi kosong berarti efek ini hanya dijalankan sekali saat komponen dimuat

  // Fungsi asynchronous untuk mengambil data produk dari Supabase
  const fetchProducts = async () => {
    setLoading(true); // Set status loading ke true
    setError(null); // Bersihkan pesan error sebelumnya
    try {
      // Mengambil data dari tabel 'produk'
      const { data, error } = await supabase
        .from("produk") // Nama tabel di Supabase
        .select("*")    // Mengambil semua kolom
        .order("created_at", { ascending: false }); // Mengurutkan berdasarkan waktu pembuatan terbaru

      if (error) {
        // Jika ada error dari Supabase
        console.error("DEBUG: Gagal mengambil data produk dari Supabase:", error);
        setError("Gagal memuat produk. Silakan coba lagi nanti."); // Pesan error yang user-friendly
      } else {
        // Jika berhasil mengambil data
        setProducts(data || []); // Pastikan data tidak null, set ke array kosong jika null
        console.log("DEBUG: Data mentah dari Supabase berhasil diambil:", data);
        if (data && data.length > 0) {
            console.log("DEBUG: Contoh ID Produk pertama dari Supabase:", data[0].id_produk);
        }
      }
    } catch (err) {
      // Tangani error tak terduga (misalnya masalah jaringan)
      console.error("DEBUG: Terjadi error tak terduga saat memuat produk:", err);
      setError("Terjadi error tak terduga saat memuat produk.");
    } finally {
      setLoading(false); // Set status loading ke false setelah proses selesai (berhasil/gagal)
    }
  };

  // Daftar kategori produk yang tersedia
  const categories = ["all", "skincare", "makeup", "haircare", "fragrance"];

  // useMemo untuk memfilter dan mengurutkan produk secara efisien
  // Ini akan dihitung ulang hanya jika `products`, `searchTerm`, `selectedCategory`, atau `sortBy` berubah
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) =>
        // Gunakan optional chaining (?) untuk menghindari error jika 'category' tidak ada
        product.category?.toLowerCase() === selectedCategory
      );
    }

    // Logika pengurutan produk berdasarkan kriteria yang dipilih
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        // Urutkan berdasarkan rating, dengan fallback ke 0 jika rating null/undefined
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
      default:
        // Urutkan berdasarkan tanggal pembuatan (terbaru duluan)
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    console.log("DEBUG: Produk setelah filter dan sort:", filtered);
    if (filtered && filtered.length > 0) {
        console.log("DEBUG: Contoh ID Produk pertama setelah filter/sort:", filtered[0].id_produk);
    }
    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]); // Dependensi useMemo

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Hero Section - Bagian atas halaman dengan judul dan deskripsi */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="flex justify-center mb-6">
            <Sparkles className="w-16 h-16 text-orange-200 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Istana <span className="text-orange-200">Cosmetic</span>
          </h1>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Temukan produk kecantikan premium yang akan membuatmu tampil memukau setiap hari
          </p>
          <div className="flex justify-center space-x-4 text-orange-100">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>100% Original</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 fill-current" />
              <span>Kualitas Premium</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Pengiriman Cepat</span>
            </div>
          </div>
        </div>
        {/* Desain gelombang di bagian bawah hero section */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="url(#gradient1)"/>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,165,0,0.3)" />
                <stop offset="100%" stopColor="rgba(255,255,255,1)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search and Filter Section - Bagian input pencarian dan filter */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-orange-100">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari produk impianmu..."
                className="w-full pl-12 pr-4 py-4 border-2 border-orange-200 rounded-2xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 text-gray-700 bg-orange-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-orange-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-400 bg-white text-gray-700 font-medium"
              >
                <option value="all">Semua Kategori</option>
                <option value="skincare">Perawatan Kulit</option>
                <option value="makeup">Makeup</option>
                <option value="haircare">Perawatan Rambut</option>
                <option value="fragrance">Parfum</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center space-x-3">
              <span className="text-orange-600 font-medium">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-400 bg-white text-gray-700 font-medium"
              >
                <option value="newest">Terbaru</option>
                <option value="price-low">Harga Terendah</option>
                <option value="price-high">Harga Tertinggi</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conditional Rendering: Loading, Error, No Products Found, or Product Grid */}
        {loading ? (
          // Tampilan loading saat data sedang diambil
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto border-4 border-t-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
            <p className="text-gray-600 text-lg mt-4">Memuat produk...</p>
          </div>
        ) : error ? (
          // Tampilan error jika ada masalah saat mengambil data
          <div className="text-center py-20 text-red-600">
            <p className="text-xl font-semibold mb-4">Error: {error}</p>
            <button
              onClick={fetchProducts} // Tombol untuk mencoba mengambil data lagi
              className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors duration-300"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          // Tampilan jika tidak ada produk yang ditemukan setelah filter/pencarian
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Produk tidak ditemukan</h3>
            <p className="text-gray-600 text-lg">Coba ubah kata kunci pencarian atau filter yang dipilih</p>
          </div>
        ) : (
          // Tampilan utama grid produk jika ada produk yang ditemukan
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Koleksi Produk <span className="text-orange-600">({filteredProducts.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => {
                // DEBUG: Log nilai product.id_produk saat merender kartu
                console.log("DEBUG: Merender kartu produk. Product ID:", product.id_produk);
                
                const hasDiscount = product.discount > 0;
                // Menghitung harga diskon:
                // Jika ada diskon (discount > 0) DAN original_price ada, gunakan original_price untuk perhitungan.
                // Jika tidak ada diskon ATAU original_price tidak ada, gunakan harga 'price' normal.
                const discountedPrice = hasDiscount && product.original_price
                  ? product.original_price * (1 - product.discount / 100)
                  : product.price;

                return (
                  // Penting: Gunakan product.id_produk sebagai key untuk kinerja React yang optimal
                  <div
                    key={product.id_produk}
                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-orange-100 hover:border-orange-300 transform hover:-translate-y-2"
                  >
                    {/* Product Image */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
                      <img
                        src={product.image || "/fallback.png"} // Gunakan gambar fallback jika product.image kosong
                        alt={product.name} // Atribut alt untuk aksesibilitas
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null; // Mencegah looping error jika gambar fallback juga gagal
                          e.target.src = "/fallback.png"; // Ganti dengan gambar fallback
                        }}
                      />

                      {/* Overlay dengan badge (BARU, RESTOCK, PROMO) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.is_new && (
                          <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                            ✨ BARU
                          </span>
                        )}
                        {product.is_restocked && (
                          <span className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                            📦 RESTOCK
                          </span>
                        )}
                        {product.promo && (
                          <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                            🔥 PROMO
                          </span>
                        )}
                      </div>

                      {/* Diskon Badge (Hanya tampil jika ada diskon) */}
                      {hasDiscount && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-3 py-2 rounded-full shadow-xl transform rotate-12 animate-pulse">
                            -{product.discount}%
                          </div>
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                        {product.name}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {product.description || "Produk kecantikan berkualitas premium untuk tampilan memukau Anda."}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating || 0) // Jika rating null, dianggap 0
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {product.rating ? product.rating.toFixed(1) : "Belum ada rating"}
                        </span>
                      </div>

                      {/* Price Section (Menampilkan Harga Diskon atau Normal) */}
                      <div className="mb-4">
                        {hasDiscount ? (
                          <div className="space-y-1">
                            <div className="text-sm text-gray-400 line-through">
                              {/* Tampilkan original_price jika ada, jika tidak, gunakan price */}
                              Rp {Number(product.original_price || product.price).toLocaleString("id-ID")}
                            </div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                              Rp {Number(discountedPrice).toLocaleString("id-ID")}
                            </div>
                          </div>
                        ) : (
                          // Tampilkan harga normal jika tidak ada diskon
                          <div className="text-2xl font-bold text-gray-900">
                            Rp {Number(product.price).toLocaleString("id-ID")}
                          </div>
                        )}
                      </div>

                      {/* Status and Buy Button */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-semibold px-3 py-2 rounded-full flex items-center gap-2 ${
                            product.status === "In Stock" // Sesuaikan dengan nilai di DB Anda
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              product.status === "In Stock" ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></span>
                          {product.status === "In Stock" ? "Tersedia" : "Habis"}
                        </span>

                        <button
                          // KRUSIAL: Pengecekan untuk mencegah id_produk=eq.undefined
                          onClick={() => {
                            console.log("DEBUG: Tombol 'Beli' diklik. product.id_produk saat klik:", product.id_produk);
                            if (product.id_produk) {
                              navigate(`/listpemesanan?id=${product.id_produk}`);
                            } else {
                              // Ini akan dieksekusi jika product.id_produk memang undefined saat klik
                              console.warn("PERINGATAN: Mencoba navigasi dengan ID produk tidak valid untuk:", product.name);
                              alert("Maaf, produk ini tidak dapat dipesan saat ini. Silakan coba produk lain.");
                            }
                          }}
                          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          <ShoppingBag className="w-4 h-4 inline mr-1" />
                          Beli
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Footer CTA Section */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white py-16 mt-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-orange-200" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Mulai Perjalanan Kecantikanmu Hari Ini
          </h2>
          <p className="text-xl text-orange-100 mb-8 leading-relaxed">
            Dapatkan produk kecantikan terbaik dengan kualitas premium dan harga terjangkau
          </p>
          <button className="bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-xl">
            Jelajahi Semua Produk
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductUser;