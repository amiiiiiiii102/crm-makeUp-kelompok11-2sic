import React, { useState, useEffect, useMemo } from "react";
import { Star, Trash2, Pencil } from "lucide-react";
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
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen font-sans">
      <div className="mb-10 pt-4">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center leading-tight">
          Manajemen Produk{" "}
          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
            Istana Cosmetik
          </span>
        </h2>

        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-3">
          Daftar Produk
        </h3>

        {/* Input Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari produk berdasarkan nama..."
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-600 text-lg py-10">
            Tidak ada produk ditemukan. Tambahkan produk baru untuk memulai!
            <br />
            <button
              onClick={() => navigate("/tambah/produk")}
              className="mt-6 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition-colors duration-300 transform hover:scale-105"
            >
              Tambah Produk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => {
              const hasDiscount = product.discount > 0;
              const discountedPrice = hasDiscount && product.original_price
                ? product.original_price * (1 - product.discount / 100)
                : product.price;

              return (
                <div
                  key={product.id_produk}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1 relative group border border-gray-100"
                >
                  <div className="relative h-50 w-full bg-gray-100 overflow-hidden">
                    <img
                      src={product.image || "/fallback.png"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/fallback.png";
                      }}
                    />
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between p-3 pointer-events-none">
                      <div className="flex flex-col items-start gap-2">
                        {product.is_new && (
                          <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-md">
                            ✨ Baru
                          </span>
                        )}
                        {product.is_restocked && (
                          <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-md">
                            📦 Restok
                          </span>
                        )}
                        {product.promo && (
                          <span className="bg-yellow-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-md">
                            🔥 Promo
                          </span>
                        )}
                      </div>
                      {hasDiscount && (
                        <div className="self-end mt-2">
                          <span className="bg-red-600 text-white text-sm font-extrabold px-3 py-1.5 rounded-full shadow-lg transform -rotate-3">
                            -{product.discount}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {product.description || "Tidak ada deskripsi produk."}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      {hasDiscount ? (
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-400 line-through">
                            Rp {Number(product.original_price || product.price).toLocaleString("id-ID")}
                          </span>
                          <span className="text-2xl font-extrabold text-red-600">
                            Rp {Number(discountedPrice).toLocaleString("id-ID")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-extrabold text-gray-900">
                          Rp {Number(product.price).toLocaleString("id-ID")}
                        </span>
                      )}
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full text-yellow-700 text-sm font-semibold">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {product.rating ? product.rating.toFixed(1) : "-"}
                      </div>
                    </div>

                    <div className="mb-2">
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-2 ${product.status === "In Stock"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {product.status}
                        <span
                          className={`w-2 h-2 rounded-full ${product.status === "In Stock" ? "bg-green-500" : "bg-red-500"
                            }`}
                        ></span>
                      </span>
                    </div>

                    {/* Edit & Hapus tombol dibuat lebih dekat ke konten */}
                    <div className="flex justify-between items-center border-t border-gray-100 pt-2 mt-auto">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm py-1"
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id_produk, product.image)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold text-sm py-1"
                      >
                        <Trash2 className="w-4 h-4" /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-16 mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-3">
          Statistik Produk
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
  );
};

const StatCard = ({ color = "gray", value, label }) => {
  const colorClass = {
    blue: "text-blue-600",
    green: "text-green-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
    gray: "text-gray-600",
  }[color];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className={`text-4xl font-extrabold ${colorClass} mb-3`}>{value}</div>
      <div className="text-gray-700 text-lg font-medium">{label}</div>
    </div>
  );
};

export default ProductManagement;
