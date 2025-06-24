import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';// Assuming bcrypt is used for password hashing
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Eye, EyeOff, Mail, Lock, Star, CheckCircle, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Handle email verification redirect
  useEffect(() => {
    
    const verified = searchParams.get('verified');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (verified === 'true') {
      setSuccessMessage('Email berhasil diverifikasi! Silakan login dengan akun Anda.');
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      setErrorMessage(`Verifikasi gagal: ${errorDescription || error}`);
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Auto-hide messages after 5 seconds
    if (verified || error) {
      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear messages when user starts typing
    if (errorMessage) setErrorMessage('');
    if (successMessage) setSuccessMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    // Validation
    if (!formData.email || !formData.password) {
      setErrorMessage('Mohon isi semua field');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Format email tidak valid');
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.email.trim().toLowerCase(), formData.password);

      if (result.success) {
        // Clear form
        setFormData({ email: '', password: '' });
        
        // Success message
        setSuccessMessage('Login berhasil! Mengalihkan...');

        // Navigate based on user role
        setTimeout(() => {
          if (result?.user?.role === 'admin') {
            navigate('/dashboard');
          } else {
            navigate('/produk');
          }
        }, 1000);

      } else {
        // Handle specific Supabase login errors
        if (result.message?.includes('Invalid login credentials')) {
          setErrorMessage('Email atau password salah');
        } else if (result.message?.includes('Email not confirmed')) {
          setErrorMessage(
            'Email belum diverifikasi. Silakan cek email Anda dan klik link konfirmasi terlebih dahulu.'
          );
        } else if (result.message?.includes('Too many requests')) {
          setErrorMessage('Terlalu banyak percobaan login. Silakan tunggu beberapa menit.');
        } else {
          setErrorMessage(result.message || 'Terjadi kesalahan saat login');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Terjadi kesalahan saat login. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute bottom-32 right-10 w-12 h-12 bg-pink-300 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
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
            <p className="text-gray-600">Masuk ke akun Anda</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-900" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 backdrop-blur-sm"
                required
                disabled={loading}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-900" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 backdrop-blur-sm"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-900 hover:text-gray-1000 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-900 hover:text-gray-1000 transition-colors" />
                )}
              </button>
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-purple-600 hover:text-purple-800 transition-colors">
                Lupa password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Masuk...
                </div>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 bg-white">atau</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Belum punya akun?{' '}
              <a href="/register" className="text-purple-600 hover:text-purple-800 font-semibold transition-colors">
                Daftar sekarang
              </a>
            </p>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2025 Istana Cosmetic. Semua hak dilindungi.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;