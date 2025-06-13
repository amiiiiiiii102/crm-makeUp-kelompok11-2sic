import { Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";

import { Route } from "react-router-dom";
import Pelanggan from "./pages/Pelanggan";
import ProductManagement from "./pages/ProductManagement";
import SalesManagement from "./pages/SalesManagement";
import FAQ from "./pages/FAQ";
import ProductForm from "./pages/ProductForm";
import ChatPelanggan from "./pages/ChatPelanggan";
import Home from "./components/Home";

function App(){
  return(
    <Routes>
      {/* Route ke halaman Home */}
      <Route path="/" element={<Home />} />

      {/* Nested Routes di dalam MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pelanggan" element={<Pelanggan />} />
        <Route path="/produk" element={<ProductManagement />} />
        <Route path="/penjualan" element={<SalesManagement />} />
        <Route path="/ProductForm" element={<ProductForm />} />
        <Route path="/ChatPelanggan" element={<ChatPelanggan />} />
        <Route path="/FAQ" element={<FAQ />} />
      </Route>
    </Routes>
  )
}

export default App;