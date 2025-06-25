import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import { supabase } from '../../Supabase';
import bcrypt from 'bcryptjs';
import { Eye, EyeOff, Mail, Lock, Star, User, Phone, Check, X, Shield } from 'lucide-react';

const Register = () => {
  const { register, loading: authLoading } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));

    // Password validation
    if (name === 'password') {
      setPasswordValidation({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value)
      });
    }
  };

  const handleRegister = async (e) => {
  e.preventDefault();

  // Clear previous messages
  setErrorMessage('');
  setSuccessMessage('');

  // Set loading state
  setLoading(true);

  try {
    // Validasi form
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMessage('Mohon isi semua field');
      setLoading(false);
      return;
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Format email tidak valid');
      setLoading(false);
      return;
    }

    // Validasi password requirements
    const { length, uppercase, lowercase, number } = passwordValidation;
    if (!length || !uppercase || !lowercase || !number) {
      setErrorMessage('Password harus minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka');
      setLoading(false);
      return;
    }

    // Validasi password confirmation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Password dan konfirmasi password tidak cocok');
      setLoading(false);
      return;
    }

    // Validasi terms agreement
    if (!formData.agreeTerms) {
      setErrorMessage('Anda harus menyetujui syarat dan ketentuan');
      setLoading(false);
      return;
    }

    // ✅ SUPABASE SIGNUP WITH EMAIL CONFIRMATION
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        // URL redirect setelah konfirmasi email
        emailRedirectTo: `${window.location.origin}/login?verified=true`,
        // Data tambahan yang akan disimpan ke auth.users metadata
        data: {
          email: formData.email,
          created_at: new Date().toISOString()
        }
      }
    });

    if (error) {
      // Handle specific Supabase errors
      if (error.message.includes('User already registered')) {
        setErrorMessage('Email sudah terdaftar. Silakan gunakan email lain atau login.');
      } else if (error.message.includes('Password should be at least')) {
        setErrorMessage('Password terlalu lemah. Gunakan minimal 6 karakter.');
      } else {
        setErrorMessage(error.message || 'Terjadi kesalahan saat registrasi.');
      }
      setLoading(false);
      return;
    }
    if (data.user) {
  // Hash password
  const hashedPassword = await bcrypt.hash(formData.password, 10);

  // Simpan ke tabel "users"
  const { error: insertError } = await supabase.from('users').insert([{
    id: data.user.id, // pakai ID dari Supabase Auth
    email: formData.email,
    password: hashedPassword,
    role: 'pelanggan', //defult role
    created_at: new Date().toISOString()
  }]);

  if (insertError) {
    console.error('Gagal menyimpan ke tabel users:', insertError);
    setErrorMessage('Registrasi berhasil, tapi gagal menyimpan data pengguna.');
    return;
  }
}


    // Success response
    if (data.user && !data.user.email_confirmed_at) {
      setSuccessMessage(
        `Email konfirmasi telah dikirim ke ${formData.email}. ` +
        'Silakan cek email Anda dan klik link konfirmasi untuk menyelesaikan registrasi.'
      );

      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      });

      // Reset password validation
      setPasswordValidation({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false
      });

      // Optional: Show additional instruction
      setTimeout(() => {
        setSuccessMessage(prev => 
          prev + ' Setelah konfirmasi, Anda akan diarahkan ke halaman login.'
        );
      }, 3000);

    } else if (data.user && data.user.email_confirmed_at) {
      // Jika email sudah terconfirm (tidak memerlukan konfirmasi)
      setSuccessMessage('Registrasi berhasil! Anda akan diarahkan ke halaman login.');
      
      // setTimeout(() => {
      //   window.location.href = '/login';
      // }, 2000);
    }

  } catch (error) {
    console.error('Registration error:', error);
    setErrorMessage('Terjadi kesalahan saat registrasi. Silakan coba lagi.');
  } finally {
    setLoading(false);
  }
};

  const isPasswordMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const isPasswordMismatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute bottom-32 right-10 w-12 h-12 bg-pink-300 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Register Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                <img src="/images/logo.png" alt="logo" className="w-18 h-18 object-contain" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Istana Cosmetic
            </h1>
            <p className="text-gray-600">Buat akun baru Anda</p>
            
            {/* Success Message */}
            {successMessage && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm font-medium">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
              </div>
            )}
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 backdrop-blur-sm"
                required
                disabled={loading || authLoading}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 backdrop-blur-sm"
                required
                disabled={loading || authLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                disabled={loading || authLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                )}
              </button>
            </div>

            {/* Password Validation */}
            {formData.password && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Syarat Password:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center ${passwordValidation.length ? 'text-green-600' : 'text-gray-400'}`}>
                    {passwordValidation.length ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                    Min. 8 karakter
                  </div>
                  <div className={`flex items-center ${passwordValidation.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                    {passwordValidation.uppercase ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                    Huruf besar
                  </div>
                  <div className={`flex items-center ${passwordValidation.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                    {passwordValidation.lowercase ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                    Huruf kecil
                  </div>
                  <div className={`flex items-center ${passwordValidation.number ? 'text-green-600' : 'text-gray-400'}`}>
                    {passwordValidation.number ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                    Angka
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Konfirmasi Password"
                className={`w-full pl-12 pr-12 py-4 border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 backdrop-blur-sm ${isPasswordMismatch ? 'border-red-300' : isPasswordMatch ? 'border-green-300' : 'border-gray-200'
                  }`}
                required
                disabled={loading || authLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                disabled={loading || authLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                )}
              </button>
            </div>

            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className="text-sm">
                {isPasswordMatch ? (
                  <p className="text-green-600 flex items-center">
                    <Check className="w-4 h-4 mr-1" />
                    Password cocok
                  </p>
                ) : isPasswordMismatch ? (
                  <p className="text-red-600 flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    Password tidak cocok
                  </p>
                ) : null}
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="cursor-pointer mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                required
                disabled={loading || authLoading}
              />
              <label className="text-sm text-gray-600">
                Saya setuju dengan{' '}
                <a href="#" className="text-purple-600 hover:text-purple-800 font-semibold">
                  Syarat dan Ketentuan
                </a>{' '}
                serta{' '}
                <a href="#" className="text-purple-600 hover:text-purple-800 font-semibold">
                  Kebijakan Privasi
                </a>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading || authLoading || !formData.agreeTerms}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading || authLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Mendaftar...
                </div>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 bg-white">atau</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <a href="Login" className="text-purple-600 hover:text-purple-800 font-semibold transition-colors">
                Masuk di sini
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2025 Istana Cosmetic. Semua hak dilindungi.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;