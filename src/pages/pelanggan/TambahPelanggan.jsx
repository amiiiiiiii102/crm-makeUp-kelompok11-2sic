import React, { useState, useContext } from 'react';
import { PelangganContext } from '../pelanggan/PelangganContext';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Mail, Phone, MapPin, Calendar,
  CreditCard, Star, Camera, Upload, CheckCircle, X,
  Link
} from 'lucide-react';

const TambahPelanggan = () => {
  const navigate = useNavigate();

  const { pelanggan, setPelanggan } = useContext(PelangganContext);

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [alamat, setAlamat] = useState('');
  const [noHp, setNoHp] = useState('');
  const [fotoProfil, setFotoProfil] = useState(null);
  const [errorNoHp, setErrorNoHp] = useState("");
  const [errorNama, setErrorNama] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorAlamat, setErrorAlamat] = useState("");

  // Generate default profile image with initials
  const generateDefaultImage = (name) => {
    const initials = name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const colors = [
      { bg: '#4F46E5', text: 'white' }, // Indigo
      { bg: '#7C3AED', text: 'white' }, // Violet  
      { bg: '#DC2626', text: 'white' }, // Red
      { bg: '#059669', text: 'white' }, // Emerald
      { bg: '#D97706', text: 'white' }, // Amber
      { bg: '#DB2777', text: 'white' }, // Pink
    ];

    const colorIndex = name.length % colors.length;
    const color = colors[colorIndex];

    return `data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100' height='100' fill='${encodeURIComponent(color.bg)}'/%3e%3ctext x='50' y='50' font-family='Arial, sans-serif' font-size='36' font-weight='bold' text-anchor='middle' dy='0.35em' fill='${color.text}'%3e${initials}%3c/text%3e%3c/svg%3e`;
  };
  const [kategori, setKategori] = useState('bronze');
  const [tanggalBergabung, setTanggalBergabung] = useState(() =>
    new Date().toISOString().substring(0, 10)
  );
  const [totalPesanan, setTotalPesanan] = useState(0);
  const [totalBelanja, setTotalBelanja] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  // Validasi nomor HP - hanya angka, spasi, tanda hubung, dan tanda kurung
  const handleNoHpChange = (e) => {
    const value = e.target.value;
    // Hanya izinkan angka, spasi, tanda hubung, dan tanda kurung
    const validValue = value.replace(/[^0-9\s\-\(\)\+]/g, '');
    setNoHp(validValue);
  };

  const handleSubmit = () => {
    const errors = {
      nama: nama.trim() === "" ? "Kolom ini tidak boleh kosong!" : "",
      email: email.trim() === "" ? "Kolom ini tidak boleh kosong!" : "",
      alamat: alamat.trim() === "" ? "Kolom ini tidak boleh kosong!" : "",
      noHp: noHp.trim() === "" ? "Kolom ini tidak boleh kosong!" :
        !/\d/.test(noHp) ? "Nomor HP harus mengandung angka!" : ""
    };

    // Set error state sekaligus
    setErrorNama(errors.nama);
    setErrorEmail(errors.email);
    setErrorAlamat(errors.alamat);
    setErrorNoHp(errors.noHp);

    // Jika ada error, hentikan
    if (Object.values(errors).some(err => err)) {
      return;
    }

    const pelangganBaru = {
      pelanggan_id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      nama,
      email,
      alamat,
      noHp,
      kategori,
      tanggalBergabung,
      fotoProfil: fotoProfil || generateDefaultImage(nama),
      totalPesanan,
      totalBelanja,
    };

    setPelanggan([...pelanggan, pelangganBaru]);

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
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 4000);
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
                Berhasil Ditambahkan!
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Pelanggan baru telah berhasil disimpan
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
                    {fotoProfil ? (
                      <img src={fotoProfil} alt="Preview" className="w-full h-full object-cover" />
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
                  value={noHp}
                  onChange={handleNoHpChange}
                  className={`w-full border rounded px-3 py-2 focus:outline-none ${errorNoHp ? "border-red-500" : "border-gray-300"
                    }`}

                  placeholder="Contoh: 08123456789"

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
                  value={tanggalBergabung}
                  onChange={(e) => setTanggalBergabung(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
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
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Tambah Pelanggan</span>
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TambahPelanggan;