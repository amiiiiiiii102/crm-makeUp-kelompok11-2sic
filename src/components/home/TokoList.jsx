import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { MapPin, Phone, Star, Clock, ShoppingBag } from "lucide-react"; // MessageSquare tidak digunakan, bisa dihapus jika tidak perlu

export default function TokoList() {
  const [tokoList, setTokoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToko = async () => {
      setLoading(true);
      setError(null);
      console.log("Memulai fetching data toko...");
      const { data, error: supabaseError } = await supabase.from("toko").select("*").order("nama");

      if (!supabaseError) {
        console.log("Data toko dari Supabase:", data);
        setTokoList(data);
      } else {
        console.error("Error fetching toko data from Supabase:", supabaseError);
        setError("Gagal memuat daftar toko. Silakan coba lagi nanti.");
      }
      setLoading(false);
    };
    fetchToko();
  }, []);

  // Fungsi untuk membuat URL Google Maps dari koordinat toko
  const getGoogleMapsUrl = (latitude, longitude, namaToko) => {
    if (!latitude || !longitude) return "#"; // Kembali ke '#' jika koordinat tidak ada
    // Menggunakan format URL Google Maps untuk pencarian koordinat dengan label
    // Contoh: https://www.google.com/maps/search/?api=1&query=LAT,LNG&query_place_id=PLACE_ID
    // Atau lebih sederhana untuk langsung ke koordinat: https://www.google.com/maps/dir/?api=1&destination=LAT,LNG
    // Atau yang paling umum untuk menampilkan lokasi: https://www.google.com/maps/place/NAMA_TOKO/@LAT,LNG,ZOOMz
    // Untuk tujuan ini, kita akan gunakan format yang sederhana dan umum untuk membuka di Google Maps
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">Places</h2> {/* Warna konsisten */}
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          <span className="ml-3 text-gray-600">Memuat daftar toko...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">Places</h2> {/* Warna konsisten */}
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (tokoList.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">Places</h2> {/* Warna konsisten */}
        <div>Tidak ada toko yang tersedia.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-6">Places</h2> {/* Warna konsisten */}

      <div className="space-y-4">
        {tokoList.map((toko) => { // Hapus 'index' karena tidak lagi digunakan untuk key
          // console.log(`Rendering toko:`, {
          //   nama: toko.nama,
          //   uuid: toko.uuid,
          //   gambar: toko.gambar,
          //   hasGambar: !!toko.gambar
          // });

          return (
            // Pastikan 'key' berada di elemen terluar dari setiap item yang di-map
            <div key={toko.uuid} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
              {/* Store Image */}
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                {/* Pastikan kolom 'gambar' ada di tabel Supabase dan berisi URL gambar */}
                {toko.gambar ? (
                  <img
                    src={toko.gambar}
                    alt={toko.nama}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log(`Error loading image for ${toko.nama}:`, e.target.src);
                      e.target.style.display = 'none'; // Sembunyikan gambar jika error
                      // Tampilkan placeholder jika gambar gagal dimuat
                      e.target.parentNode.querySelector('.image-placeholder').style.display = 'flex';
                    }}
                  />
                ) : (
                  // Placeholder jika tidak ada gambar atau gambar gagal dimuat
                  <div className="w-full h-full flex items-center justify-center image-placeholder">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Store Information */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                  {toko.nama}
                </h3>

                {/* Rating and Reviews */}
                {toko.rating && (
                  <div className="flex items-center text-sm mb-1">
                    <span className="font-medium text-gray-700 mr-1">{toko.rating}</span>
                    <div className="flex items-center mr-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={`${toko.uuid}-star-${i}`}
                          className={`w-4 h-4 ${
                            i < Math.floor(toko.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    
                  </div>
                )}

                {/* Address and Phone */}
                <div className="flex items-start mb-1">
                  <MapPin className="w-4 h-4 mr-1 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    {/* Link dinamis ke Google Maps menggunakan koordinat toko */}
                    <a
                      href={getGoogleMapsUrl(toko.latitude, toko.longitude, toko.nama)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      {toko.alamat}
                    </a>
                    {toko.telp && (
                      <span className="text-sm text-gray-600 ml-2">· {toko.telp}</span>
                    )}
                  </div>
                </div>

                {/* Status (Open/Closes) and Services */}
                <div className="flex items-center text-sm">
                  <span className="text-green-600 font-medium mr-1">Open</span>
                  {toko.jam_buka && (
                    <span className="text-gray-500 mr-1">
                      · Closes {toko.jam_buka}
                    </span>
                  )}
                  {/* Menampilkan layanan dari kolom 'layanan' Supabase secara dinamis */}
                  {toko.layanan && (
                    <span className="text-gray-500">
                      {toko.jam_buka ? ' · ' : ''} {/* Tambahkan titik jika ada jam_buka */}
                      {Array.isArray(toko.layanan) ? toko.layanan.join(" · ") : toko.layanan}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}