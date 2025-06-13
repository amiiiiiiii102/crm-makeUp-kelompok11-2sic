import { Routes, Route } from "react-router-dom";
import Home from "./components/Home"; // Halaman utama (di luar layout dashboard)
import MainLayout from "./components/MainLayout";

import Dashboard from "./pages/Dashboard";
import Pelanggan from "./pages/Pelanggan";
import ProductManagement from "./pages/ProductManagement";
import SalesManagement from "./pages/SalesManagement";
import ProductForm from "./pages/ProductForm";
import ChatPelanggan from "./pages/ChatPelanggan";
import FAQ from "./pages/FAQ";

function App() {
  return (
    <Routes>
      {/* Halaman Home (tanpa layout) */}
      <Route path="/" element={<Home />} />

      {/* Halaman Dashboard dan lainnya (dengan MainLayout) */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pelanggan" element={<Pelanggan />} />
        <Route path="/produk" element={<ProductManagement />} />
        <Route path="/penjualan" element={<SalesManagement />} />
        <Route path="/productform" element={<ProductForm />} />
        <Route path="/chatpelanggan" element={<ChatPelanggan />} />
        <Route path="/faq" element={<FAQ />} />
      </Route>
    </Routes>
  );
}

export default App;
