import React from "react";
import TokoList from "./TokoList";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TokoMap from "./TokoMap";
import { Palette, Sparkles, Brush, Star, MessageCircle, Camera, Gift } from "lucide-react";

export default function TokoPage() {
  // Anda bisa mendefinisikan URL media sosial di sini, atau sebagai variabel global jika digunakan di banyak tempat
  const whatsappLink = "https://wa.me/6281234567890"; // Ganti dengan nomor WhatsApp Anda
  const instagramLink = "https://instagram.com/istanacosmetic"; // Ganti dengan username Instagram Anda

  return (
    <> {/* Fragment digunakan untuk mengelompokkan elemen-elemen */}
      <Navbar activeNav="TokoPage" />
      
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-rose-50">
        {/* Header Section - Makeup Theme */}
        <div className="relative overflow-hidden">
          {/* Makeup-inspired background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-red-400 rounded-full blur-xl"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-orange-400 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-rose-400 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-yellow-300 rounded-full blur-lg"></div>
            <div className="absolute bottom-1/3 right-1/4 w-14 h-14 bg-indigo-300 rounded-full blur-lg"></div>
          </div>

          <div className="relative bg-white/80 backdrop-blur-sm border-b border-red-200">
            <div className="max-w-7xl mx-auto px-4 py-16">
              <div className="text-center">
                <div className="flex justify-center items-center gap-3 mb-6">
                  <Palette className="w-8 h-8 text-red-500 animate-pulse" />
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
                    Toko Kami
                  </h1>
                  <Brush className="w-8 h-8 text-orange-500 animate-pulse" />
                </div>
                <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mb-6 rounded-full"></div>
                <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
                  Temukan toko resmi Istana Cosmetic terdekat dari lokasi Anda ✨ 
                  Kunjungi dan nikmati pengalaman belanja langsung dengan layanan terbaik.
                </p>
                
                {/* Makeup-themed floating elements */}
                <div className="flex justify-center gap-4 mt-8">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-red-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-red-500" />
                      <span className="text-gray-700 font-medium">Premium Makeup</span>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-gray-700 font-medium">Beauty Expert</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Store Information Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Store List Card - Makeup Theme */}
            <div className="group">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-red-200 overflow-hidden hover:shadow-2xl hover:border-red-300 transition-all duration-500">
                <div className="bg-gradient-to-r from-red-500 via-orange-500 to-rose-500 p-6 relative overflow-hidden">
                  {/* Makeup brush strokes pattern */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
                  <div className="absolute top-1/2 left-1/2 w-2 h-16 bg-white/10 rotate-45 transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">
                        Daftar Cabang
                      </h2>
                      <p className="text-red-100 text-sm">
                        Informasi lengkap semua cabang makeup store
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50">
                  <TokoList />
                </div>
              </div>
            </div>

            {/* Store Map Card - Makeup Theme */}
            <div className="group">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-orange-200 overflow-hidden hover:shadow-2xl hover:border-orange-300 transition-all duration-500">
                <div className="bg-gradient-to-r from-orange-500 via-indigo-500 to-red-500 p-6 relative overflow-hidden">
                  {/* Makeup palette colors pattern */}
                  <div className="absolute top-2 right-4 w-4 h-4 bg-yellow-300 rounded-full opacity-50"></div>
                  <div className="absolute top-8 right-8 w-3 h-3 bg-red-300 rounded-full opacity-50"></div>
                  <div className="absolute bottom-4 left-4 w-5 h-5 bg-green-300 rounded-full opacity-50"></div>
                  <div className="absolute bottom-8 left-8 w-6 h-6 bg-blue-300 rounded-full opacity-50"></div>
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Brush className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">
                        Peta Lokasi
                      </h2>
                      <p className="text-orange-100 text-sm">
                        Temukan rute tercepat menuju beauty destination
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-orange-50 to-indigo-50">
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <TokoMap />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Section - Makeup Theme */}
          <div className="max-w-md mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-rose-200 overflow-hidden hover:shadow-2xl transition-all duration-500">
              {/* Header with makeup palette gradient */}
              <div className="bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 p-6 relative overflow-hidden">
                {/* Makeup compact mirror effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                {/* Makeup brush strokes */}
                <div className="absolute top-1/2 left-1/4 w-1 h-12 bg-white/20 rotate-12 transform -translate-y-6"></div>
                <div className="absolute top-1/2 right-1/4 w-1 h-8 bg-white/20 rotate-45 transform -translate-y-4"></div>
                <div className="relative text-center">
                  <div className="flex justify-center items-center gap-2 mb-3">
                    <MessageCircle className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold text-white">
                      Hubungi Kami
                    </h3>
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-red-100 text-sm">
                    Kami siap melayani Anda di sosial media
                  </p>
                </div>
              </div>

              {/* Social Media Links with makeup theme */}
              <div className="p-8 bg-gradient-to-br from-rose-50 to-red-50">
                <div className="flex justify-center gap-6 mb-6">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="WhatsApp"
                    className="group relative"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <img
                        src="/images/wa.png"
                        alt="WhatsApp"
                        className="w-8 h-8 filter brightness-0 invert"
                      />
                    </div>
                    {/* Makeup compact mirror reflection */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-300 to-orange-300 rounded-full opacity-80"></div>
                  </a>

                  <a
                    href={instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram"
                    className="group relative"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-red-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
                      <img
                        src="/images/ig.png"
                        alt="Instagram"
                        className="w-8 h-8"
                      />
                    </div>
                    {/* Makeup highlighter effect */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-300 to-red-300 rounded-full opacity-80"></div>
                  </a>
                </div>

                {/* Call to Action with makeup theme */}
                <div className="text-center space-y-3">
                  <p className="text-gray-600 text-sm">
                    Dapatkan update terbaru dan promo menarik ✨
                  </p>
                  <div className="flex justify-center gap-2">
                    <span className="bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                      💄 Makeup Tips
                    </span>
                    <span className="bg-gradient-to-r from-orange-100 to-rose-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                      ✨ Beauty Trends
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info Section - Makeup Theme */}
          <div className="mt-12 text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-red-200 p-8 relative overflow-hidden">
              {/* Makeup palette background */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-red-200 to-orange-200 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-200 to-rose-200 rounded-full opacity-20 translate-x-12 translate-y-12"></div>
              {/* Makeup brush strokes */}
              <div className="absolute top-1/4 right-1/4 w-2 h-20 bg-red-200 opacity-30 rotate-45 rounded-full"></div>
              <div className="absolute bottom-1/4 left-1/4 w-2 h-16 bg-orange-200 opacity-30 rotate-12 rounded-full"></div>
              
              <div className="relative">
                <div className="flex justify-center items-center gap-3 mb-4">
                  <Palette className="w-8 h-8 text-red-500" />
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    Kunjungi Toko Kami Sekarang!
                  </h3>
                  <Sparkles className="w-8 h-8 text-orange-500" />
                </div>
                
                
                
                <div className="flex flex-wrap justify-center gap-4">
                  
                  <div className="bg-gradient-to-r from-orange-100 to-rose-100 rounded-full px-6 py-3 text-orange-700 font-medium shadow-sm hover:shadow-md transition-all duration-300">
                    <Gift className="w-4 h-4 inline mr-2" />
                    Gratis Ongkir
                  </div>
                  <div className="bg-gradient-to-r from-rose-100 to-red-100 rounded-full px-6 py-3 text-rose-700 font-medium shadow-sm hover:shadow-md transition-all duration-300">
                    <Palette className="w-4 h-4 inline mr-2" />
                    Produk Original
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}