// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
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
import Artikel from "./components/home/Artikel";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./route/ProtectedRoute";
import PublicRoute from "./route/PublicRoute";
import NotFound from "./pages/NotFound";
import UploadData from "./pages/pelanggan/UploadData";
import SettingAkun from "./pages/auth/SettingAkun";
import ListArtikel from "./pages/ListArtikel";
import ArtikelForm from "./pages/ArtikelForm";
import ListPemesanan from "./pages/ListPemesanan";
import PemesananForm from "./pages/PemesananForm";

// Tambahan halaman publik
import Produk from "./components/home/Produk";
import Testimoni from "./components/home/Testimoni";
import Kontak from "./components/home/Kontak";

function App() {
  return (
    <Routes>
      {/* Halaman publik */}
      <Route path="/" element={<Home />} />
      <Route path="/produk" element={<Produk />} />
      <Route path="/testimoni" element={<Testimoni />} />
      <Route path="/artikel" element={<Artikel />} />
      <Route path="/kontak" element={<Kontak />} />
      <Route path="/homefaq" element={<FAQ />} />
      <Route path="*" element={<NotFound />} />

      {/* Halaman login dan register */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Halaman dashboard dan fitur lainnya */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pelanggan" element={<Pelanggan />} />
        <Route path="/tambahpelanggan" element={<TambahPelanggan />} />
        <Route path="/editpelanggan/:pelanggan_id" element={<EditPelanggan />} />
        <Route path="/produkmanagement" element={<ProductManagement />} />
        <Route path="/penjualan" element={<SalesManagement />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pelanggan"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Pelanggan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/uploadData"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UploadData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tambahpelanggan"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <TambahPelanggan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editpelanggan/:pelanggan_id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditPelanggan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/penjualan"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SalesManagement />
            </ProtectedRoute>
          }
        />
        <Route path="/produk" element={<ProductManagement />} />
        <Route path="/productform" element={<ProductForm />} />
        <Route path="/pemesanan" element={<Pemesanan />} />
        <Route path="/listpemesanan" element={<ListPemesanan />} />
        <Route path="/formpemesanan" element={<PemesananForm />} />
        <Route path="/chatpelanggan" element={<ChatPelanggan />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/listartikel" element={<ListArtikel />} />
        <Route path="/formartikel" element={<ArtikelForm />} />
        <Route path="/setting" element={<SettingAkun />} />
      </Route>
    </Routes>
  );
}

export default App;
