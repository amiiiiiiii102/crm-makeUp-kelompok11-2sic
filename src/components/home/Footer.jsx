import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  // Fungsi untuk scroll ke atas saat link diklik
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-white px-6 py-12 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand + Slogan */}
        <div>
          <img src="/images/logo.png" alt="Logo" className="w-12 mb-2" />
          <h2 className="text-lg font-semibold text-orange-400">Istana Cosmetic</h2>
          <p className="text-sm text-gray-400 mt-2">
            Cantik itu pilihan, percaya diri itu kekuatan.
          </p>
        </div>

        {/* Navigasi */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-orange-300">Navigasi</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" onClick={scrollToTop} className="hover:text-orange-400">Home</Link></li>
            <li><Link to="/produk" onClick={scrollToTop} className="hover:text-orange-400">Produk</Link></li>
            <li><Link to="/artikel" onClick={scrollToTop} className="hover:text-orange-400">Artikel</Link></li>
            <li><Link to="/testimoni" onClick={scrollToTop} className="hover:text-orange-400">Testimoni</Link></li>
            <li><Link to="/faq" onClick={scrollToTop} className="hover:text-orange-400">FAQ</Link></li>
            <li><Link to="/TokoPage" onClick={scrollToTop} className="hover:text-orange-400">Toko Kami</Link></li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-orange-300">Hubungi Kami</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Jl. Suka Karya, Pekanbaru
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} />
              <a href="https://wa.me/6281337723772" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition">
                (+62) 813-3772-3772
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} />
              <a href="mailto:istana.cosmetic@gmail.com" className="hover:text-orange-400 transition">
                istana.cosmetic@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Sosial Media */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-orange-300">Follow Kami</h3>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/istana.cosmetics" target="_blank" rel="noopener noreferrer">
              <Instagram size={22} className="hover:text-orange-400 transition" />
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Dapatkan promo & update menarik ✨
          </p>
        </div>
      </div>

      {/* Footer Bawah */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © 2025 Istana Cosmetic. All rights reserved.
      </div>
    </footer>
  );
}
