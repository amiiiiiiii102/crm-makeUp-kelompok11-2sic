import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const ProductManagement = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const products = [
    {
      id: 1,
      name: "Tartan Shirt Icy",
      price: "Rp 189,000",
      rating: 4.83,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/White_domesticated_duck%2C_stretching.jpg/1200px-White_domesticated_duck%2C_stretching.jpg",
      status: "In Stock",
      isNew: true,
      endsSoon: "Ends in 5 days"
    },
    {
      id: 2,
      name: "Loose Shirt Denim",
      price: "Rp 189,000",
      rating: 5,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/White_domesticated_duck%2C_stretching.jpg/1200px-White_domesticated_duck%2C_stretching.jpg",
      status: "In Stock",
      isNew: true,
      endsSoon: "Ends in 5 days"
    },
    {
      id: 3,
      name: "Tweed Blazer Gla...",
      price: "Rp 339,000",
      rating: 4.8,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/White_domesticated_duck%2C_stretching.jpg/1200px-White_domesticated_duck%2C_stretching.jpg",
      status: "In Stock",
      isNew: true,
      endsSoon: "Ends in 5 days"
    },
    {
      id: 4,
      name: "Andante Cardigan...",
      price: "Rp 259,000",
      rating: 5,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/White_domesticated_duck%2C_stretching.jpg/1200px-White_domesticated_duck%2C_stretching.jpg",
      status: "In Stock",
    },
    {
      id: 5,
      name: "Tweed Blazer Ha...",
      price: "Rp 339,000",
      rating: 5,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/White_domesticated_duck%2C_stretching.jpg/1200px-White_domesticated_duck%2C_stretching.jpg",
      status: "In Stock",
      isNew: true,
    },
    {
      id: 6,
      name: "Basic Shirt Black",
      price: "Rp 179,000",
      rating: 4.93,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/White_domesticated_duck%2C_stretching.jpg/1200px-White_domesticated_duck%2C_stretching.jpg",
      status: "Available",
      isRestocked: true,
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, products.length - 4));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, products.length - 4)) % Math.max(1, products.length - 4));
  };

  const visibleProducts = products.slice(currentSlide, currentSlide + 5);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Produk Terlaris</h2>
        
        <div className="relative">
          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200"
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200"
            disabled={currentSlide >= products.length - 5}
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-12">
            {visibleProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                {/* Product Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Top Badges */}
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

                  {/* Ends Soon Badge */}
                  {product.endsSoon && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                        {product.endsSoon}
                      </span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded flex items-center gap-1 ${
                      product.status === 'In Stock' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {product.status}
                      <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-gray-800 font-medium text-sm mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      {product.price}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Categories or Additional Sections */}
      <div className="mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-200">
            <div className="text-2xl font-bold text-blue-600 mb-2">{products.length}</div>
            <div className="text-gray-600 text-sm">Total Products</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-200">
            <div className="text-2xl font-bold text-green-600 mb-2">{products.filter(p => p.status === 'In Stock').length}</div>
            <div className="text-gray-600 text-sm">In Stock</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-200">
            <div className="text-2xl font-bold text-orange-600 mb-2">{products.filter(p => p.isNew).length}</div>
            <div className="text-gray-600 text-sm">New Items</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-200">
            <div className="text-2xl font-bold text-purple-600 mb-2">4.8</div>
            <div className="text-gray-600 text-sm">Avg Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;