import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import Pelanggan from "./pages/pelanggan/Pelanggan";
import TambahPelanggan from "./pages/pelanggan/TambahPelanggan";
import EditPelanggan from "./pages/pelanggan/EditPelanggan";
import ProductManagement from "./pages/ProductManagement";
import SalesManagement from "./pages/SalesManagement";
import ProductForm from "./pages/ProductForm";
import Pemesanan from "./pages/Pemesanan";
import ChatPelanggan from "./pages/ChatPelanggan";
import FAQ from "./pages/FAQ";
import Artikel from "./pages/Artikel";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Routes>
      {/* Halaman publik (tanpa layout) */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Halaman dengan layout dashboard */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pelanggan" element={<Pelanggan />} />
        <Route path="/tambahpelanggan" element={<TambahPelanggan />} />
        <Route path="/editpelanggan/:pelanggan_id" element={<EditPelanggan />} />
        <Route path="/produk" element={<ProductManagement />} />
        <Route path="/penjualan" element={<SalesManagement />} />
        <Route path="/productform" element={<ProductForm />} />
        <Route path="/pemesanan" element={<Pemesanan />} />
        <Route path="/chatpelanggan" element={<ChatPelanggan />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/artikel" element={<Artikel />} />
      </Route>
    </Routes>
  );
}

export default App;
