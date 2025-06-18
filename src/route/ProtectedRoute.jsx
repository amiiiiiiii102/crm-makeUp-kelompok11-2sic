// components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../pages/auth/AuthContext' 
import { useContext } from 'react';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  
  // Jika tidak ada user yang login, redirect ke login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Jika sudah login, tampilkan children (MainLayout + halaman)
  return children;
};

export default ProtectedRoute;