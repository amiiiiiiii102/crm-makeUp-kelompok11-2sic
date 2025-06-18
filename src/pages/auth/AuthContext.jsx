import React, { createContext, useEffect, useState } from 'react';
import bcrypt from 'bcryptjs';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const register = (email, password) => {
    try {
      setLoading(true);

      // Validasi email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, message: 'Format email tidak valid' };
      }

      // Cek email sudah ada
      const existing = users.find(user => user.email === email);
      if (existing) {
        return { success: false, message: 'Email sudah terdaftar' };
      }

      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Buat user baru dengan ID dan timestamp
      const newUser = {
        id: Date.now().toString(),
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };

      setUsers(prev => [...prev, newUser]);
      return { success: true, message: 'Registrasi berhasil' };

    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Terjadi kesalahan saat registrasi' };
    } finally {
      setLoading(false);
    }
  };

  const login = (email, password) => {
    try {
      setLoading(true);

      // Validasi email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, message: 'Format email tidak valid' };
      }

      // Cari user berdasarkan email
      const user = users.find(user => user.email === email);
      if (!user) {
        return { success: false, message: 'Email tidak ditemukan' };
      }

      // Cek password
      const isPasswordMatch = bcrypt.compareSync(password, user.password);
      if (!isPasswordMatch) {
        return { success: false, message: 'Password salah' };
      }

      // Set user login dengan timestamp
      const userSession = {
        ...user,
        loginAt: new Date().toISOString()
      };

      setCurrentUser(userSession);
      return { success: true, message: 'Login berhasil' };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Terjadi kesalahan saat login' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
  };

  // Helper function untuk cek apakah user sudah login
  const isAuthenticated = () => {
    return currentUser !== null;
  };

  return (
    <AuthContext.Provider value={{
      users,
      currentUser,
      loading,
      register,
      login,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};