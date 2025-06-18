import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home"; // Halaman utama tanpa layout
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import Pelanggan from "./pages/pelanggan/Pelanggan";
import ProductManagement from "./pages/ProductManagement";
import SalesManagement from "./pages/SalesManagement";
import ProductForm from "./pages/ProductForm";
import Pemesanan from "./pages/Pemesanan";
import ChatPelanggan from "./pages/ChatPelanggan";
import FAQ from "./pages/FAQ";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import TambahPelanggan from "./pages/pelanggan/TambahPelanggan";
import EditPelanggan from "./pages/pelanggan/EditPelanggan";
import ProtectedRoute from "./route/ProtectedRoute";
import PublicRoute from "./route/PublicRoute";
import NotFound from "./pages/NotFound"; 
import Artikel from "./pages/Artikel";


function App() {
  return (
  <Routes>
  {/* Route yang bisa diakses tanpa login */}
  <Route path="/" element={<Home />} />
  <Route path="*" element={<NotFound />} />
  
  {/* Route login/register - tidak bisa diakses jika sudah login */}
  <Route path="/login" element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  } />
  
  <Route path="/register" element={
    <PublicRoute>
      <Register />
    </PublicRoute>
  } />

  {/* Route yang butuh login */}
  <Route element={
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  }>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/pelanggan" element={<Pelanggan />} />
    <Route path="/editpelanggan/:pelanggan_id" element={<EditPelanggan />} />
    <Route path="/tambahpelanggan" element={<TambahPelanggan />} />
    <Route path="/produk" element={<ProductManagement />} />
    <Route path="/penjualan" element={<SalesManagement />} />
    <Route path="/ProductForm" element={<ProductForm />} />
    <Route path="/ChatPelanggan" element={<ChatPelanggan />} />
    <Route path="/FAQ" element={<FAQ />} />
    <Route path="/artikel" element={<Artikel />} />
  </Route>
</Routes>

  );
}

export default App;
