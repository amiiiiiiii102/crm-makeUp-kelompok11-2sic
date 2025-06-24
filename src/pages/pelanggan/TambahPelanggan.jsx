import React, { useState, useContext } from 'react';
import { PelangganContext } from '../pelanggan/PelangganContext';
import { useNavigate } from 'react-router-dom';
import { generateDefaultImage } from '../../generateDefaultImage';
import { supabase } from '../../Supabase'; // Import supabase client
import {
  ArrowLeft, User, Mail, Phone, MapPin, Calendar,
  CreditCard, Star, Camera, Upload, CheckCircle, X,
  Link, Loader2
} from 'lucide-react';

const TambahPelanggan = () => {
  const navigate = useNavigate();
  const { tambahPelanggan, isLoading: contextLoading } = useContext(PelangganContext);

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [alamat, setAlamat] = useState('');
  const [nohp, setNoHp] = useState('');
  const [fotoprofil, setFotoProfil] = useState(null);
  const [errorNoHp, setErrorNoHp] = useState("");
  const [errorNama, setErrorNama] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorAlamat, setErrorAlamat] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [kategori, setKategori] = useState('bronze');
  const [tanggalbergabung, setTanggalBergabung] = useState(() =>
    new Date().toISOString().substring(0, 10)
  );
  const [totalpesanan, setTotalPesanan] = useState(0);
  const [totalbelanja, setTotalBelanja] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      try {
        // Upload file ke Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;

        const { data, error } = await supabase.storage
          .from('pelanggan-photos') // Pastikan bucket ini sudah dibuat di Supabase
          .upload(filePath, file);

        if (error) {
          console.error('Error uploading file:', error);
          alert('Gagal mengupload foto');
          return;
        }

        // Dapatkan URL publik dari file yang diupload
        const { data: { publicUrl } } = supabase.storage
          .from('pelanggan-photos')
          .getPublicUrl(filePath);

        setFotoProfil(publicUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Terjadi kesalahan saat mengupload foto');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Validasi nomor HP - hanya angka, spasi, tanda hubung, dan tanda kurung
  const handleNoHpChange = (e) => {
    const value = e.target.value;
    // Hanya izinkan angka, spasi, tanda hubung, dan tanda kurung
    const validValue = value.replace(/[^0-9\s\-\(\)\+]/g, '');
    setNoHp(validValue);
  };

  const handleSubmit = async () => {
    // Validasi form
    const errors = {
      nama: nama.trim() === "" ? "Kolom ini tidak boleh kosong!" : "",
      email: email.trim() === "" ? "Kolom ini tidak boleh kosong!" : "",
      alamat: alamat.trim() === "" ? "Kolom ini tidak boleh kosong!" : "",
      nohp: nohp.trim() === "" ? "Kolom ini tidak boleh kosong!" :
        !/\d/.test(nohp) ? "Nomor HP harus mengandung angka!" : ""
    };

    // Set error state sekaligus
    setErrorNama(errors.nama);
    setErrorEmail(errors.email);
    setErrorAlamat(errors.alamat);
    setErrorNoHp(errors.nohp);

    // Jika ada error, hentikan
    if (Object.values(errors).some(err => err)) {
      return;
    }

    setIsLoading(true);

    try {
      // Siapkan data pelanggan baru
      const pelangganBaru = {
  nama,
  email,
  alamat,
  nohp: nohp,
  kategori,
  tanggalbergabung: tanggalbergabung,
  fotoprofil: fotoprofil || generateDefaultImage(nama),
  totalpesanan: totalpesanan,
  totalbelanja: totalbelanja,
};

      // Gunakan fungsi dari context
      await tambahPelanggan(pelangganBaru);

      // Reset form
      setNama('');
      setEmail('');
      setAlamat('');
      setNoHp('');
      setFotoProfil(null);
      setKategori('bronze');
      setTanggalBergabung(new Date().toISOString().substring(0, 10));
      setTotalPesanan(0);
      setTotalBelanja(0);
      
      // Tampilkan modal sukses
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 4000);

    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menambahkan pelanggan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-700">Menyimpan data...</span>
          </div>
        </div>
      )}

      {/* Card Pesan Sukses */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-scale-in">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-sm mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Berhasil Ditambahkan!
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Pelanggan baru telah berhasil disimpan ke database
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Konten Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Tambah Pelanggan Baru
                </h1>
                <p className="text-gray-600 mt-1">
                  Kelola informasi dan aktivitas pelanggan
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Foto Profil */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Camera className="w-4 h-4 inline mr-2" />
                  Foto Profil
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
                    {fotoprofil ? (
                      <img src={fotoprofil} alt="Preview" className="w-full h-full object-cover" />
                    ) : nama ? (
                      <img src={generateDefaultImage(nama)} alt="Default" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </label>
                  {fotoprofil && (
                    <button
                      onClick={() => setFotoProfil(null)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={isLoading}
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>

              {/* Input lainnya */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errorNama ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Nama pelanggan"
                  disabled={isLoading}
                />
                {errorNama && <p className="text-red-500 text-sm mt-1">{errorNama}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errorEmail ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Email pelanggan"
                  disabled={isLoading}
                />
                {errorEmail && <p className="text-red-500 text-sm mt-1">{errorEmail}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Alamat
                </label>
                <textarea
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  rows={3}
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errorAlamat ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Alamat lengkap"
                  disabled={isLoading}
                />
                {errorAlamat && <p className="text-red-500 text-sm mt-1">{errorAlamat}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Nomor HP
                </label>
                <input
                  type="tel"
                  value={nohp}
                  onChange={handleNoHpChange}
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errorNoHp ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Contoh: 08123456789"
                  disabled={isLoading}
                />
                {errorNoHp && <p className="text-red-500 text-sm mt-1">{errorNoHp}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Hanya angka, spasi, tanda hubung (-), dan tanda kurung () diperbolehkan
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Tanggal Bergabung
                </label>
                <input
                  type="date"
                  value={tanggalbergabung}
                  onChange={(e) => setTanggalBergabung(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Star className="w-4 h-4 inline mr-2" />
                  Kategori
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                >
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Total Pesanan
                </label>
                <input
                  type="number"
                  value={totalpesanan}
                  onChange={(e) => setTotalPesanan(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Belanja (Rp)
                </label>
                <input
                  type="number"
                  value={totalbelanja}
                  onChange={(e) => setTotalBelanja(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>* Field wajib diisi</p>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                type="button"
                onClick={() => navigate('/pelanggan')}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Menyimpan...' : 'Tambah Pelanggan'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TambahPelanggan;