// components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../pages/auth/AuthContext' 
import { useContext } from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useContext(AuthContext);
  if (!currentUser) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" />; // Halaman akses ditolak
  }

  return children;
};


export default ProtectedRoute;