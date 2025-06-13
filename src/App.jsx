import { Routes, Route } from "react-router-dom";
import Home from "./components/Home"; // Halaman utama (tanpa layout dashboard)
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import Pelanggan from "./pages/Pelanggan";
import ProductManagement from "./pages/ProductManagement";
import SalesManagement from "./pages/SalesManagement";
import ProductForm from "./pages/ProductForm";
import ChatPelanggan from "./pages/ChatPelanggan";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Artikel from "./pages/Artikel";

function App() {
  return (
    <Routes>
      {/* Halaman Home dan Auth tanpa layout */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Semua halaman yang membutuhkan layout dashboard */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pelanggan" element={<Pelanggan />} />
        <Route path="/produk" element={<ProductManagement />} />
        <Route path="/penjualan" element={<SalesManagement />} />
        <Route path="/productform" element={<ProductForm />} />
        <Route path="/chatpelanggan" element={<ChatPelanggan />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/artikel" element={<Artikel />} />
      </Route>
    </Routes>
  );
}

export default App;
