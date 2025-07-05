import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { supabase } from "../../supabase";
import "leaflet/dist/leaflet.css"; // Mengimpor CSS Leaflet untuk styling peta
import L from "leaflet"; // Mengimpor pustaka Leaflet itu sendiri, diperlukan untuk perbaikan ikon marker

// --- Perbaikan Ikon Marker Default Leaflet ---
// Leaflet memiliki isu umum di mana ikon marker default tidak muncul saat dibundel oleh Webpack/alat serupa.
// Kode ini secara eksplisit mengatur ulang jalur URL untuk gambar ikon marker default.
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});
// --- Akhir Perbaikan Ikon Marker ---

export default function TokoMap() {
  // State untuk menyimpan data lokasi toko yang diambil dari Supabase
  const [lokasiToko, setLokasiToko] = useState([]);
  // State untuk menunjukkan status loading data
  const [loading, setLoading] = useState(true);
  // State untuk menyimpan pesan error jika terjadi kesalahan
  const [error, setError] = useState(null);

  // useEffect hook untuk mengambil data peta saat komponen dimuat pertama kali
  useEffect(() => {
    const fetchMapData = async () => {
      setLoading(true); // Set loading menjadi true saat memulai fetching data
      setError(null); // Reset error state
      console.log("Memulai fetching data peta dari Supabase...");

      // Mengambil data 'nama', 'latitude', dan 'longitude' dari tabel 'toko' di Supabase
      const { data, error: supabaseError } = await supabase
        .from("toko")
        .select("nama, latitude, longitude");

      if (!supabaseError) {
        console.log("Data mentah dari Supabase:", data);

        // Memproses data: mengkonversi latitude dan longitude ke tipe float
        // dan memfilter data yang tidak valid (NaN, null, undefined)
        const parsedData = data
          .map((toko) => {
            const parsedLatitude = parseFloat(toko.latitude);
            const parsedLongitude = parseFloat(toko.longitude);
            return {
              ...toko,
              latitude: parsedLatitude,
              longitude: parsedLongitude,
            };
          })
          .filter(
            (toko) =>
              !isNaN(toko.latitude) &&
              toko.latitude !== null &&
              toko.latitude !== undefined &&
              !isNaN(toko.longitude) &&
              toko.longitude !== null &&
              toko.longitude !== undefined
          );

        console.log("Data lokasi toko setelah parsing dan filtering:", parsedData);
        setLokasiToko(parsedData); // Menyimpan data toko yang sudah diproses ke state
      } else {
        console.error("Error fetching map data from Supabase:", supabaseError);
        setError("Gagal memuat data toko. Silakan coba lagi nanti."); // Set pesan error
      }
      setLoading(false); // Set loading menjadi false setelah fetching selesai (berhasil atau gagal)
    };

    fetchMapData(); // Panggil fungsi fetching data
  }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali saat mount

  // useMemo hook untuk menentukan pusat peta default.
  // Akan menggunakan koordinat toko pertama jika tersedia dan valid,
  // jika tidak, akan menggunakan koordinat default Pekanbaru.
  const defaultCenter = useMemo(() => {
    if (lokasiToko.length > 0 && lokasiToko[0].latitude && lokasiToko[0].longitude) {
      console.log("Menggunakan koordinat toko pertama sebagai pusat peta:", {
        lat: lokasiToko[0].latitude,
        lng: lokasiToko[0].longitude,
      });
      // Mengembalikan array [latitude, longitude] yang diharapkan oleh Leaflet
      return [lokasiToko[0].latitude, lokasiToko[0].longitude];
    }
    const pekanbaruCoords = [0.507068, 101.447748]; // Koordinat default Pekanbaru, Indonesia
    console.log(
      "Tidak ada toko atau koordinat tidak valid, menggunakan Pekanbaru sebagai pusat:",
      pekanbaruCoords
    );
    return pekanbaruCoords;
  }, [lokasiToko]); // Dependensi pada lokasiToko agar pusat peta dihitung ulang saat data toko berubah


  // --- Penanganan Kondisi Loading dan Error ---
  if (loading) {
    return <div>Loading Maps...</div>; // Tampilkan pesan loading saat data sedang diambil
  }

  if (error) {
    return <div>Error: {error}</div>; // Tampilkan pesan error jika terjadi kesalahan
  }

  // Menampilkan pesan jika tidak ada data lokasi toko yang valid setelah loading selesai
  if (lokasiToko.length === 0 && defaultCenter[0] === 0.507068 && defaultCenter[1] === 101.447748) {
    return <div>Tidak ada data lokasi toko yang tersedia untuk ditampilkan.</div>;
  }
  // --- Akhir Penanganan Kondisi ---

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Peta Lokasi</h2>
      <div className="w-full h-96 bg-gray-100 rounded-xl overflow-hidden">
        {/* MapContainer adalah wadah utama peta dari react-leaflet */}
        <MapContainer
          center={defaultCenter} // Pusat peta (array [latitude, longitude])
          zoom={12} // Tingkat zoom awal peta
          scrollWheelZoom={true} // Mengizinkan zoom dengan scroll mouse
          className="w-full h-full" // Kelas CSS untuk mengatur lebar dan tinggi peta
        >
          {/* TileLayer menampilkan ubin peta dari OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // URL server tile OpenStreetMap
          />
          {/* Melakukan iterasi (loop) pada array lokasiToko untuk menampilkan setiap marker */}
          {lokasiToko.map((toko) => {
            console.log(`Mencoba merender marker untuk ${toko.nama}:`, {
              lat: toko.latitude,
              lng: toko.longitude,
            });
            // Hanya merender Marker jika latitude dan longitude valid
            return (
              toko.latitude &&
              toko.longitude &&
              !isNaN(toko.latitude) &&
              !isNaN(toko.longitude) && (
                // Marker untuk setiap lokasi toko
                <Marker
                  key={toko.nama} // Key unik untuk setiap marker (penting untuk React)
                  position={[toko.latitude, toko.longitude]} // Posisi marker (array [latitude, longitude])
                >
                  {/* Popup yang muncul saat marker diklik, menampilkan nama toko */}
                  <Popup>{toko.nama}</Popup>
                </Marker>
              )
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}