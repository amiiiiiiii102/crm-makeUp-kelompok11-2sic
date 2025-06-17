import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PelangganContext } from '../pelanggan/PelangganContext';
import {
  ArrowLeft, User, Mail, Phone, MapPin, Calendar,
  CreditCard, Star, Camera, Upload, CheckCircle
} from 'lucide-react';

const EditPelanggan = () => {
  const { pelanggan, editPelanggan } = useContext(PelangganContext);
  const { pelanggan_id } = useParams();
  const navigate = useNavigate();

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [alamat, setAlamat] = useState('');
  const [noHp, setNoHp] = useState('');
  const [fotoProfil, setFotoProfil] = useState(null);
  const [kategori, setKategori] = useState('bronze');
  const [tanggalBergabung, setTanggalBergabung] = useState('');
  const [totalPesanan, setTotalPesanan] = useState(0);
  const [totalBelanja, setTotalBelanja] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const data = pelanggan.find(pelanggan => pelanggan.pelanggan_id === pelanggan_id);
    if (data) {
      setNama(data.nama);
      setEmail(data.email);
      setAlamat(data.alamat);
      setNoHp(data.noHp);
      setFotoProfil(data.fotoProfil);
      setKategori(data.kategori);
      setTanggalBergabung(data.tanggalBergabung);
      setTotalPesanan(data.totalPesanan);
      setTotalBelanja(data.totalBelanja);
      
    }
  }, [pelanggan_id, pelanggan]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFotoProfil(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (nama && email && alamat && noHp && kategori && tanggalBergabung) {
      const updatedData = {
        pelanggan_id,
        nama,
        email,
        alamat,
        noHp,
        kategori,
        tanggalBergabung,
        fotoProfil,
        totalPesanan,
        totalBelanja,
      };

      editPelanggan(pelanggan_id, updatedData);
      setShowSuccessModal(true);
setTimeout(() => {
  setShowSuccessModal(false);
}, 4000); // tampil 2 detik, lalu pindah halaman

    } else {
      alert("Harap lengkapi semua field terlebih dahulu!");
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
      {/* Card Pesan Sukses */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-scale-in">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-sm mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Berhasil Diubah!
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Data pelanggan berhasil diubah
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Edit Data Pelanggan
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
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    {fotoProfil ? (
                      <img src={fotoProfil} alt="Preview" className="w-full h-full object-cover" />
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
                    />
                  </label>
                  {fotoProfil && (
                    <button
                      onClick={() => setFotoProfil(null)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>

              {/* Input Fields */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Nama pelanggan"
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Email pelanggan"
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                  placeholder="Alamat lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Nomor HP
                </label>
                <input
                  type="tel"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Nomor HP"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Tanggal Bergabung
                </label>
                <input
                  type="date"
                  value={tanggalBergabung}
                  onChange={(e) => setTanggalBergabung(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                  value={totalPesanan}
                  onChange={(e) => setTotalPesanan(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Belanja (Rp)
                </label>
                <input
                  type="number"
                  value={totalBelanja}
                  onChange={(e) => setTotalBelanja(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                className="cursor-pointer px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => navigate('/pelanggan')}
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPelanggan;
