import React, { useState,useContext } from 'react';
import { AuthContext } from './AuthContext';
import {useNavigate} from 'react-router-dom';
import { User, Lock, Trash2, Mail, Eye, EyeOff, Camera, Crown, Sparkles, Shield } from 'lucide-react';

const SettingAkun = () => {
    const navigate = useNavigate();
    const { currentUser, logout, handleDeleteAccount } = useContext(AuthContext);

  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [emailCode, setEmailCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Data pengguna contoh
  const userData = {
    name: 'Princess Beauty',
    email: 'princess@istanacosmetic.com',
    category: 'VIP Member',
    memberSince: '2023'
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCurrentPhoto(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSendCode = () => {
    setIsCodeSent(true);
    // Simulasi pengiriman kode
    alert('Kode verifikasi telah dikirim ke email Anda!');
  };

  const handleVerifyCode = () => {
    if (emailCode.length === 6) {
      setIsVerified(true);
      alert('Kode berhasil diverifikasi!');
    } else {
      alert('Masukkan kode 6 digit yang valid!');
    }
  };

  const handlePasswordChange = () => {
    if (!isVerified) {
      alert('Silakan verifikasi email terlebih dahulu!');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Konfirmasi password tidak cocok!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password minimal 8 karakter!');
      return;
    }
    alert('Password berhasil diubah!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsVerified(false);
    setIsCodeSent(false);
    setEmailCode('');
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      {/* Header */}
      {/* <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-12 h-12 mr-3 text-yellow-300" />
            <h1 className="text-4xl font-bold">Istana Cosmetic</h1>
          </div>
          <p className="text-xl opacity-90">Pengaturan Akun Anda</p>
          <div className="flex items-center justify-center mt-2">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
            <span className="text-sm">Your Beauty Kingdom Settings</span>
            <Sparkles className="w-5 h-5 ml-2 text-yellow-300" />
          </div>
        </div>
      </div> */}

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Info Akun */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-pink-100">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-full mr-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Informasi Akun</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                  <p className="text-gray-600 text-sm">Nama Lengkap</p>
                  <p className="font-semibold text-gray-800">{userData.name}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="font-semibold text-gray-800">{userData.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-pink-50 rounded-xl border border-yellow-200">
                  <p className="text-gray-600 text-sm">Kategori Akun</p>
                  <div className="flex items-center">
                    <Crown className="w-5 h-5 text-yellow-500 mr-2" />
                    <p className="font-bold text-yellow-600">{userData.category}</p>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                  <p className="text-gray-600 text-sm">Member Sejak</p>
                  <p className="font-semibold text-gray-800">{userData.memberSince}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Foto Profil */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-pink-100">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-full mr-4">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Foto Profil</h2>
            </div>
            
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                {currentPhoto ? (
                  <img 
                    src={currentPhoto} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-gradient-to-r from-pink-500 to-purple-600 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-200 to-purple-200 flex items-center justify-center border-4 border-pink-300">
                    <User className="w-16 h-16 text-pink-500" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-full shadow-lg">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full cursor-pointer hover:from-pink-600 hover:to-purple-700 transition-all duration-300 inline-flex items-center shadow-lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Ubah Foto Profil
                </label>
                <p className="text-gray-500 text-sm mt-2">Ukuran maksimal 5MB, format JPG/PNG</p>
              </div>
            </div>
          </div>

          {/* Ubah Password */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-pink-100">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-full mr-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Ubah Password</h2>
            </div>
            
            <div className="space-y-6">
              {/* Kirim Kode Verifikasi */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center mb-4">
                  <Mail className="w-5 h-5 text-blue-500 mr-2" />
                  <h3 className="font-semibold text-gray-800">Verifikasi Email</h3>
                </div>
                
                {!isCodeSent ? (
                  <div>
                    <p className="text-gray-600 mb-4">Kirim kode verifikasi ke email Anda untuk mengubah password</p>
                    <button
                      onClick={handleSendCode}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                    >
                      Kirim Kode Verifikasi
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600">Masukkan kode 6 digit yang dikirim ke email Anda</p>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={emailCode}
                        onChange={(e) => setEmailCode(e.target.value)}
                        placeholder="Masukkan kode"
                        maxLength="6"
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleVerifyCode}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                      >
                        Verifikasi
                      </button>
                    </div>
                    {isVerified && (
                      <div className="flex items-center text-green-600">
                        <Shield className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Email berhasil diverifikasi!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Form Password */}
              {isVerified && (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      placeholder="Password saat ini"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      placeholder="Password baru"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      placeholder="Konfirmasi password baru"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-semibold"
                  >
                    Ubah Password
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hapus Akun */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-full mr-4">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Hapus Akun</h2>
            </div>
            
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
              <p className="text-gray-700 mb-4">
                <strong>Peringatan:</strong> Menghapus akun akan menghilangkan semua data Anda secara permanen dan tidak dapat dikembalikan.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 font-semibold"
              >
                Hapus Akun Saya
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus Akun */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="bg-red-100 p-4 rounded-full inline-block mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Hapus Akun</h3>
              <p className="text-gray-600">Ketik "hapus akun saya" untuk mengkonfirmasi</p>
            </div>
            
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="hapus akun saya"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-all duration-300"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300"
              >
                Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingAkun;