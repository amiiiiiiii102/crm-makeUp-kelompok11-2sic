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
import Login from "./pages/Login";
import Register from "./pages/Register";
import TambahPelanggan from "./pages/pelanggan/TambahPelanggan";
import EditPelanggan from "./pages/pelanggan/EditPelanggan";
import Artikel from "./pages/Artikel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman publik (tanpa layout) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Halaman dengan layout dashboard */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pelanggan" element={<Pelanggan />} />
          <Route path="/editpelanggan/:pelanggan_id" element={<EditPelanggan />} />
          <Route path="/tambahpelanggan" element={<TambahPelanggan />} />
          <Route path="/produk" element={<ProductManagement />} />
          <Route path="/penjualan" element={<SalesManagement />} />
          <Route path="/productform" element={<ProductForm />} />
          <Route path="/pemesanan" element={<Pemesanan />} />
          <Route path="/chatpelanggan" element={<ChatPelanggan />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/artikel" element={<Artikel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
