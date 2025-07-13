import React from "react";
import TokoList from "./TokoList";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TokoMap from "./TokoMap";
import { Palette, Sparkles, Brush, Star, Gift } from "lucide-react";

export default function TokoPage({ withLayout = true }) {
  const content = (
    <div id="TokoPage" className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-rose-50">
      {/* HEADER */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-red-400 rounded-full blur-xl"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-orange-400 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-rose-400 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-yellow-300 rounded-full blur-lg"></div>
          <div className="absolute bottom-1/3 right-1/4 w-14 h-14 bg-indigo-300 rounded-full blur-lg"></div>
        </div>

        <div className="relative bg-white/80 backdrop-blur-sm border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
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
            <div className="flex justify-center gap-4 mt-8">
              <div className="bg-white/90 rounded-full px-6 py-3 shadow-lg border border-red-200 hover:shadow-xl transition">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-red-500" />
                  <span className="text-gray-700 font-medium">Premium Makeup</span>
                </div>
              </div>
              <div className="bg-white/90 rounded-full px-6 py-3 shadow-lg border border-orange-200 hover:shadow-xl transition">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700 font-medium">Beauty Expert</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Daftar Cabang */}
          <div className="group">
            <div className="bg-white/90 rounded-3xl shadow-lg border border-red-200 hover:shadow-2xl transition">
              <div className="bg-gradient-to-r from-red-500 via-orange-500 to-rose-500 p-6 relative">
                <div className="relative flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Daftar Cabang</h2>
                    <p className="text-red-100 text-sm">Informasi lengkap semua cabang makeup store</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50">
                <TokoList />
              </div>
            </div>
          </div>

          {/* Peta Lokasi */}
          <div className="group">
            <div className="bg-white/90 rounded-3xl shadow-lg border border-orange-200 hover:shadow-2xl transition">
              <div className="bg-gradient-to-r from-orange-500 via-indigo-500 to-red-500 p-6 relative">
                <div className="relative flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Brush className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Peta Lokasi</h2>
                    <p className="text-orange-100 text-sm">Temukan rute tercepat menuju beauty destination</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-orange-50 to-indigo-50">
                <TokoMap />
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="bg-white/90 rounded-3xl shadow-lg border border-red-200 p-8 relative overflow-hidden">
            <div className="relative">
              <div className="flex justify-center items-center gap-3 mb-4">
                <Palette className="w-8 h-8 text-red-500" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Kunjungi Toko Kami Sekarang!
                </h3>
                <Sparkles className="w-8 h-8 text-orange-500" />
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-gradient-to-r from-orange-100 to-rose-100 rounded-full px-6 py-3 text-orange-700 font-medium shadow-sm">
                  <Gift className="w-4 h-4 inline mr-2" />
                  Gratis Ongkir
                </div>
                <div className="bg-gradient-to-r from-rose-100 to-red-100 rounded-full px-6 py-3 text-rose-700 font-medium shadow-sm">
                  <Palette className="w-4 h-4 inline mr-2" />
                  Produk Original
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return withLayout ? (
    <>
      <Navbar activeNav="TokoPage" />
      {content}
      <Footer />
    </>
  ) : (
    content
  );
}
