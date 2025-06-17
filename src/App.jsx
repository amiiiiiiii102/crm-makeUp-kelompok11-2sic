import { Routes, Route } from "react-router-dom";
import Home from "./components/Home"; // <-- ini Home yang di luar MainLayout
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import Pelanggan from "./pages/pelanggan/Pelanggan";
import ProductManagement from "./pages/ProductManagement";
import SalesManagement from "./pages/SalesManagement";
import ProductForm from "./pages/ProductForm";
import ChatPelanggan from "./pages/ChatPelanggan";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TambahPelanggan from "./pages/pelanggan/TambahPelanggan";
import EditPelanggan from "./pages/pelanggan/EditPelanggan";

function App() {
  return (
    <Routes>
      {/* Home route di luar MainLayout */}
      <Route path="/" element={<Home />} />

      {/* Semua route lain menggunakan MainLayout */}
      {/* Route ke halaman Home */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Nested Routes di dalam MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pelanggan" element={<Pelanggan />} />
        <Route path="/editpelanggan/:pelanggan_id" element={<EditPelanggan />} />
        <Route path="/tambahpelanggan" element={<TambahPelanggan />} />
        <Route path="/produk" element={<ProductManagement />} />
        <Route path="/penjualan" element={<SalesManagement />} />
        <Route path="/ProductForm" element={<ProductForm />} />
        <Route path="/ChatPelanggan" element={<ChatPelanggan />} />
        <Route path="/FAQ" element={<FAQ />} />
      </Route>
    </Routes>
  );
}

export default App;
