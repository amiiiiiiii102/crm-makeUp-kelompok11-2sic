import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../../Supabase'; // Pastikan path ini sesuai dengan setup Supabase Anda
import { generateDefaultImage } from '../../generateDefaultImage'; // Import akun admin dari file terpisah
import bcrypt from 'bcryptjs'; 


// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // ===============================
  // REGISTRATION FUNCTION
  // ===============================
  const register = async (email, password) => {
    try {
      setLoading(true);

      // Basic validations
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, message: 'Format email tidak valid' };
      }

      if (password.length < 6) {
        return { success: false, message: 'Password harus minimal 6 karakter' };
      }

      // Check if email is admin email
      if (email === AkunAdmin.email) {
        return { success: false, message: 'Email tidak dapat digunakan untuk registrasi' };
      }

      // ✅ SUPABASE SIGNUP WITH EMAIL CONFIRMATION
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
    emailRedirectTo: 'https://crm-make-up-kelompok11-2sic.vercel.app/login' // ganti sesuai URL deploy
  },
        created_at: new Date().toISOString()
      });

      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('User already registered')) {
          return { success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' };
        } else if (error.message.includes('Password should be at least')) {
          return { success: false, message: 'Password terlalu lemah. Gunakan minimal 6 karakter.' };
        } else if (error.message.includes('Unable to validate email address')) {
          return { success: false, message: 'Format email tidak valid.' };
        } else if (error.message.includes('signup disabled')) {
          return { success: false, message: 'Pendaftaran sementara dinonaktifkan.' };
        }
        
        console.error('Registration error:', error);
        return { success: false, message: error.message || 'Terjadi kesalahan saat registrasi.' };
      }

      // Success response
      if (data.user) {
        // Create user record in users table
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id : data.user.id,
            email: data.user.email,
            role: 'user', // Default role
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (userError) {
          console.error('User creation error:', userError);
          return { success: false, message: 'Gagal membuat akun pengguna. Silakan coba lagi.' };
        }

        // Create user session
        const userSession = {
          id: data.user.id,
          id_users: data.user.id,
          email: data.user.email,
          fotoprofilusers: generateDefaultImage(email),
          role: 'pelanggan',
          loginAt: new Date().toISOString(),
          supabaseSession: data.session,
          isAdmin: false
        };

        setCurrentUser(userSession);
        return { success: true, message: 'Registrasi berhasil', user: userSession };
      }
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // LOGIN FUNCTION
  // ===============================
  const login = async (email, password) => {
  try {
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Format email tidak valid' };
    }

    // ✅ Coba login sebagai admin dulu
    const { data: adminData, error: adminError } = await supabase
      .from('admin')
      .select('*')
      .eq('email', email)
      .single();

    if (adminData) {
      const passwordMatch = await bcrypt.compare(password, adminData.password);
      if (passwordMatch) {
        const adminSession = {
          email: adminData.email,
          role: 'admin',
          loginAt: new Date().toISOString(),
          isAdmin: true
        };
        setCurrentUser(adminSession);
        return { success: true, message: 'Login admin berhasil', user: adminSession };
      }
    }

    // 🔍 Kalau bukan admin, login sebagai user biasa via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        return { success: false, message: 'Email atau password salah' };
      } else if (authError.message.includes('Email not confirmed')) {
        return {
          success: false,
          message: 'Email belum diverifikasi. Silakan cek email Anda dan klik link konfirmasi terlebih dahulu.'
        };
      } else if (authError.message.includes('Too many requests')) {
        return {
          success: false,
          message: 'Terlalu banyak percobaan login. Silakan tunggu beberapa menit.'
        };
      } else if (authError.message.includes('signup disabled')) {
        return {
          success: false,
          message: 'Akun belum aktif. Silakan hubungi administrator.'
        };
      }

      console.error('Auth error:', authError);
      return { success: false, message: authError.message || 'Terjadi kesalahan saat login' };
    }

    // ✅ Cek apakah email user sudah terverifikasi
    if (authData.user && !authData.user.email_confirmed_at) {
      await supabase.auth.signOut();
      return {
        success: false,
        message: 'Email belum diverifikasi. Silakan cek email Anda dan klik link konfirmasi terlebih dahulu.'
      };
    }

    // ✅ Ambil data user dari tabel `users`
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError || !userData) {
      await supabase.auth.signOut();
      return { success: false, message: 'Data pengguna tidak ditemukan. Silakan hubungi administrator.' };
    }

    // ✅ Buat sesi user biasa
    const userSession = {
      id: userData.id,
      id_users: userData.id_users || userData.id,
      email: userData.email,
      fotoprofilusers: generateDefaultImage(email) || userData.fotoprofilusers,
      role: userData.role || 'user',
      loginAt: new Date().toISOString(),
      supabaseSession: authData.session,
      isAdmin: false
    };

    setCurrentUser(userSession);
    return { success: true, message: 'Login berhasil', user: userSession };

  } catch (error) {
    console.error('Login error:', error);
    try {
      await supabase.auth.signOut();
    } catch (signOutError) {
      console.error('Sign out error:', signOutError);
    }
    return { success: false, message: 'Terjadi kesalahan saat login. Silakan coba lagi.' };
  } finally {
    setLoading(false);
  }
};

  // ===============================
  // LOGOUT FUNCTION
  // ===============================
  const logout = async () => {
    try {
      setLoading(true);
      
      // Only sign out from Supabase if not admin
      if (currentUser && !currentUser.isAdmin) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Logout error:', error);
          // Don't return error, still proceed with logout
        }
      }
      
      setCurrentUser(null);
      return { success: true, message: 'Logout berhasil' };
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      setCurrentUser(null);
      return { success: true, message: 'Logout berhasil' };
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteAccount = async (userId, logout, navigate) => {
  const confirm = window.confirm('Apakah Anda yakin ingin menghapus akun Anda? Tindakan ini tidak dapat dibatalkan.');

  if (!confirm) return;

  try {
    // 1. Hapus dari tabel "users" (custom table milik kamu)
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId); // Pastikan 'id' adalah kolom primary key kamu

    if (deleteError) {
      throw deleteError;
    }

    // 2. Hapus akun dari Auth Supabase (akun login)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId); // PERLU service_role key

    if (authError) {
      throw authError;
    }

    // 3. Logout dan redirect
    await logout();
    navigate('/login');
    alert('Akun berhasil dihapus.');
  } catch (error) {
    console.error('Gagal menghapus akun:', error.message);
    alert('Gagal menghapus akun: ' + error.message);
  }
};

  // ===============================
  // SESSION MANAGEMENT FUNCTIONS
  // ===============================
  
  // Check if user session is still valid on app load
  const checkAuthSession = async () => {
    try {
      setInitializing(true);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        setCurrentUser(null);
        return;
      }

      if (session && session.user) {
        // Check if email is confirmed
        if (!session.user.email_confirmed_at) {
          await supabase.auth.signOut();
          setCurrentUser(null);
          return;
        }

        // Get user data from database
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError || !userData) {
          console.error('User data not found:', userError);
          await supabase.auth.signOut();
          setCurrentUser(null);
          return;
        }

        // Restore user session
        const userSession = {
          id: userData.id,
          id_users: userData.id_users || userData.id,
          email: userData.email,
          fotoprofilusers: userData.profile_picture || userData.fotoprofilusers,
          role: userData.role || 'user',
          loginAt: session.user.last_sign_in_at,
          supabaseSession: session,
          isAdmin: false
        };

        setCurrentUser(userSession);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Auth session check error:', error);
      setCurrentUser(null);
    } finally {
      setInitializing(false);
    }
  };

  // Listen to auth state changes
  const setupAuthListener = () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_OUT' || !session) {
          // Only clear user if it's not admin
          if (currentUser && !currentUser.isAdmin) {
            setCurrentUser(null);
          }
        } else if (event === 'TOKEN_REFRESHED' && session) {
          // Update session in current user
          if (currentUser && !currentUser.isAdmin) {
            setCurrentUser(prev => ({
              ...prev,
              supabaseSession: session
            }));
          }
        }
      }
    );

    return subscription;
  };

  // ===============================
  // UTILITY FUNCTIONS
  // ===============================

  // Get current Supabase session
  const getCurrentSession = () => {
    return currentUser?.supabaseSession || null;
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return currentUser !== null;
  };

  // Check if user is admin
  const isAdmin = () => {
    return currentUser?.role === 'admin' || currentUser?.isAdmin === true;
  };

  // Get user profile
  const getUserProfile = () => {
    return currentUser;
  };

  // Update user profile (for future use)
  const updateProfile = async (updates) => {
    try {
      if (!currentUser || currentUser.isAdmin) {
        return { success: false, message: 'User tidak ditemukan' };
      }

      setLoading(true);

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id_users', currentUser.id)
        .select()
        .single();

      if (error) {
        console.error('Update profile error:', error);
        return { success: false, message: 'Gagal memperbarui profil' };
      }

      // Update current user state
      const updatedUser = {
        ...currentUser,
        ...data,
        fotoprofilusers: data.profile_picture || data.fotoprofilusers
      };

      setCurrentUser(updatedUser);
      return { success: true, message: 'Profil berhasil diperbarui', user: updatedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Terjadi kesalahan saat memperbarui profil' };
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // EFFECTS
  // ===============================
  useEffect(() => {
    checkAuthSession();
    const subscription = setupAuthListener();
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // ===============================
  // CONTEXT VALUE
  // ===============================
  const value = {
    // State
    currentUser,
    loading,
    initializing,
    
    // Auth functions
    register,
    login,
    logout,
    handleDeleteAccount,
    
    // Utility functions
    getCurrentSession,
    isAuthenticated,
    isAdmin,
    getUserProfile,
    updateProfile,
    
    // Session management
    checkAuthSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export AuthContext for direct usage (if needed)
export { AuthContext };

// Default export
export default AuthContext;