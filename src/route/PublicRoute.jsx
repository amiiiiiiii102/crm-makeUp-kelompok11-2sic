// components/PublicRoute.js
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../pages/auth/AuthContext'  
import { useContext } from 'react';

const PublicRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  
  // Jika sudah login, redirect ke dashboard
  if (currentUser) {
    return <Navigate to="/produk" replace />;
  }
  
  // Jika belum login, tampilkan halaman login/register
  return children;
};

export default PublicRoute;