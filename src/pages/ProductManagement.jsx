import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const ProductManagement = ({ products = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const maxVisible = 5;
  const maxSlide = Math.max(0, products.length - maxVisible);

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const visibleProducts = useMemo(() => {
    return products.slice(currentSlide, currentSlide + maxVisible);
  }, [products, currentSlide]);

  const avgRating = useMemo(() => {
    if (!products.length) return 0;
    const total = products.reduce((sum, p) => sum + (p.rating || 0), 0);
    return (total / products.length).toFixed(2);
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Produk Terlaris</h2>

        <div className="relative">
          {products.length > maxVisible && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition"
                disabled={currentSlide === 0}
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition"
                disabled={currentSlide >= maxSlide}
                aria-label="Selanjutnya"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-12">
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden group"
              >
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => (e.target.src = "/fallback.png")}
                  />

                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.isNew && (
                      <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        New
                      </span>
                    )}
                    {product.isRestocked && (
                      <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        Restocked
                      </span>
                    )}
                  </div>

                  {product.discountPercent && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -{product.discountPercent}%
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded flex items-center gap-1 ${
                        product.status === "In Stock"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {product.status}
                      <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-gray-800 font-medium text-sm mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">{product.price}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {product.rating || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard color="blue" value={products.length} label="Total Products" />
          <StatCard
            color="green"
            value={products.filter((p) => p.status === "In Stock").length}
            label="In Stock"
          />
          <StatCard
            color="orange"
            value={products.filter((p) => p.isNew).length}
            label="New Items"
          />
          <StatCard color="purple" value={avgRating} label="Avg Rating" />
        </div>
      </div>
    </div>
  );
};

// Reusable stat card component
const StatCard = ({ color = "gray", value, label }) => {
  const colorClass = {
    blue: "text-blue-600",
    green: "text-green-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
    gray: "text-gray-600",
  }[color];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition">
      <div className={`text-2xl font-bold ${colorClass} mb-2`}>{value}</div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  );
};

export default ProductManagement;
