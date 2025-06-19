import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import { Eye, EyeOff, Mail, Lock, Star, User, Phone, Check, X, Shield } from 'lucide-react';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    //fullName: '',
    email: '',
    //phone: '',
    password: '',
    confirmPassword: '',
    role: 'pelanggan', // Default role
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

  const handleRegister = (e) => {
    e.preventDefault();

    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');

    // Set loading state
    setLoading(true);

    // Validasi form
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
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

    // Simulasi delay untuk UX yang baik
    setTimeout(() => {
      // ✅ GUNAKAN FUNCTION REGISTER DARI AUTHCONTEXT - Include role in registration
      const result = register(formData.email, formData.password, formData.role);

      if (result.success) {
        setSuccessMessage('Registrasi berhasil!');

        // Reset form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          role: 'pelanggan',
          agreeTerms: false
        });

        // Reset password validation
        setPasswordValidation({
          length: false,
          uppercase: false,
          lowercase: false,
          number: false
        });
      } else {
        setErrorMessage(result.message);
      }

      setLoading(false);
    }, 1000);
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
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Istana Cosmetic
            </h1>
            <p className="text-gray-600">Buat akun baru Anda</p>
            {successMessage && (
              <div className="text-green-600 text-sm mb-4 text-center">
                {successMessage}
              </div>
            )}

          </div>

          {/* Registration Form */}
          <div className="space-y-5">
            {/* Full Name Input */}


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
              />
            </div>

            {/* Phone Input */}

            {/* Role Selection */}
       

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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
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
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
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
            {errorMessage && (
              <div className="text-red-600 text-sm mb-4 text-center">
                {errorMessage}
              </div>
            )}
            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={loading || !formData.agreeTerms}
              className="cursor-pointer w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Mendaftar...
                </div>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 bg-white">atau</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Google Register Button */}

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