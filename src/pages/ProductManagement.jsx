import React, { useState, useEffect, useMemo } from "react";
import { Star, Trash2, Pencil, Search, Sparkles, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data produk:", error);
    } else {
      setProducts(data || []);
    }
  };

  const handleDelete = async (id_produk, image) => {
    const confirm = window.confirm("Yakin ingin menghapus produk ini?");
    if (!confirm) return;

    let fullImagePath = null;
    if (image) {
      try {
        const url = new URL(image);
        const pathSegments = url.pathname.split('/');
        const publicIndex = pathSegments.indexOf('public');
        if (publicIndex > -1 && pathSegments.length > publicIndex + 1) {
          const bucketNameIndex = pathSegments.indexOf('gambar-produk');
          if (bucketNameIndex > -1 && pathSegments.length > bucketNameIndex + 1) {
            fullImagePath = pathSegments.slice(bucketNameIndex + 1).join('/');
          } else {
            fullImagePath = url.pathname.split('/public/').pop();
          }
        }
      } catch (e) {
        fullImagePath = image;
      }
    }

    if (fullImagePath) {
      const { error: deleteFileError } = await supabase.storage.from("gambar-produk").remove([fullImagePath]);
      if (deleteFileError) {
        console.warn("Gagal menghapus file dari bucket:", deleteFileError.message);
      }
    }

    const { error } = await supabase.from("produk").delete().eq("id_produk", id_produk);
    if (error) {
      alert("Gagal menghapus produk.");
      console.error(error);
    } else {
      setProducts((prev) => prev.filter((p) => p.id_produk !== id_produk));
    }
  };

  const handleEdit = (product) => {
    navigate("/edit/produk", { state: { product } });
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const avgRating = useMemo(() => {
    if (!products.length) return 0;
    const total = products.reduce((sum, p) => sum + (p.rating || 0), 0);
    return (total / products.length).toFixed(2);
  }, [products]);

  const totalStock = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.stock || 0), 0);
  }, [products]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="flex justify-center mb-6">
            <Sparkles className="w-16 h-16 text-orange-200 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Manajemen <span className="text-orange-200">Produk</span>
          </h1>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Kelola semua produk kecantikan premium Istana Cosmetik dengan mudah dan efisien
          </p>
          <div className="flex justify-center space-x-4 text-orange-100">
            <div className="flex items-center space-x-2">
              <Pencil className="w-5 h-5" />
              <span>Edit Mudah</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 fill-current" />
              <span>Statistik Lengkap</span>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Pencarian Cepat</span>
            </div>
          </div>
        </div>
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
        {/* Search Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-orange-100">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari produk berdasarkan nama..."
                className="w-full pl-12 pr-4 py-4 border-2 border-orange-200 rounded-2xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 text-gray-700 bg-orange-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Add Product Button */}
            <button
              onClick={() => navigate("/ProductForm")}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-4 rounded-2xl text-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              + Tambah Produk
            </button>
          </div>
        </div>

        {/* Products Section */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Produk tidak ditemukan</h3>
            <p className="text-gray-600 text-lg mb-8">Coba ubah kata kunci pencarian atau tambahkan produk baru</p>
            <button
              onClick={() => navigate("/tambah/produk")}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Tambah Produk Pertama
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Daftar Produk <span className="text-orange-600">({filteredProducts.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => {
                const hasDiscount = product.discount > 0;
                const discountedPrice = hasDiscount && product.original_price
                  ? product.original_price * (1 - product.discount / 100)
                  : product.price;

                return (
                  <div
                    key={product.id_produk}
                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-orange-100 hover:border-orange-300 transform hover:-translate-y-2"
                  >
                    {/* Product Image */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
                      <img
                        src={product.image || "/fallback.png"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/fallback.png";
                        }}
                      />
                      
                      {/* Overlay with badges */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.is_new && (
                          <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                            ✨ NEW
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
                      
                      {hasDiscount && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-3 py-2 rounded-full shadow-xl transform rotate-12 animate-pulse">
                            -{product.discount}%
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id_produk, product.image)}
                          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
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
                                i < Math.floor(product.rating || 0)
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

                      {/* Price */}
                      <div className="mb-4">
                        {hasDiscount ? (
                          <div className="space-y-1">
                            <div className="text-sm text-gray-400 line-through">
                              Rp {Number(product.original_price || product.price).toLocaleString("id-ID")}
                            </div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                              Rp {Number(discountedPrice).toLocaleString("id-ID")}
                            </div>
                          </div>
                        ) : (
                          <div className="text-2xl font-bold text-gray-900">
                            Rp {Number(product.price).toLocaleString("id-ID")}
                          </div>
                        )}
                      </div>

                      {/* Status and Actions */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-semibold px-3 py-2 rounded-full flex items-center gap-2 ${
                            product.status === "In Stock"
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

                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(product)}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-2 rounded-full text-xs font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-1"
                          >
                            <Pencil className="w-3 h-3" />
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id_produk, product.image)}
                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-full text-xs font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Statistics Section */}
        <div className="mt-20 mb-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-orange-100">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Statistik <span className="text-orange-600">Produk</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <StatCard color="blue" value={products.length} label="Total Produk" />
              <StatCard color="green" value={products.filter((p) => p.status === "In Stock").length} label="Tersedia" />
              <StatCard color="orange" value={products.filter((p) => p.is_new).length} label="Produk Baru" />
              <StatCard color="purple" value={avgRating} label="Rating Rata-rata" />
              <StatCard color="gray" value={totalStock} label="Total Stok" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white py-16 mt-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-orange-200" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Kelola Produk dengan Mudah dan Efisien
          </h2>
          <p className="text-xl text-orange-100 mb-8 leading-relaxed">
            Dashboard manajemen produk yang powerful untuk mengelola semua produk kecantikan Anda
          </p>
          <button 
            onClick={() => navigate("/tambah/produk")}
            className="bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Tambah Produk Baru
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ color = "gray", value, label }) => {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500 text-blue-600",
    green: "from-green-500 to-emerald-500 text-green-600", 
    orange: "from-orange-500 to-amber-500 text-orange-600",
    purple: "from-purple-500 to-pink-500 text-purple-600",
    gray: "from-gray-500 to-slate-500 text-gray-600",
  }[color];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100 group">
      <div className={`text-4xl font-extrabold ${colorClasses.split(' ')[2]} mb-3 group-hover:scale-110 transition-transform duration-300`}>
        {value}
      </div>
      <div className="text-gray-700 text-lg font-medium">{label}</div>
      <div className={`h-1 w-full bg-gradient-to-r ${colorClasses.substring(0, colorClasses.lastIndexOf(' '))} rounded-full mt-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
    </div>
  );
};

export default ProductManagement;