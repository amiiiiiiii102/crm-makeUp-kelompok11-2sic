// components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../pages/auth/AuthContext' 
import { useContext } from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, initializing } = useContext(AuthContext);
  if (initializing) {
    return <div className="text-center py-10">Memuat...</div>; // atau spinner loading
  }
  if (!currentUser) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/produk" />; // Halaman akses ditolak
  }


  return children;
};


export default ProtectedRoute;