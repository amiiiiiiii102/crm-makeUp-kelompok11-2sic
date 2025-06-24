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
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./route/ProtectedRoute";
import PublicRoute from "./route/PublicRoute";
import NotFound from "./pages/NotFound";
import UploadData from "./pages/pelanggan/UploadData";
import SettingAkun from "./pages/auth/SettingAkun";

function App() {
  return (
    <Routes>
      {/* Halaman publik */}
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />


      {/* Halaman login dan register (dibungkus PublicRoute) */}
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

      {/* Halaman dashboard dan fitur lainnya (dibungkus ProtectedRoute + MainLayout) */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <Dashboard />
    </ProtectedRoute>
  }
/>
        <Route path="/pelanggan" element={
        <ProtectedRoute allowedRoles={['admin']}>
        <Pelanggan />
        </ProtectedRoute>}/>
        
        <Route path="/uploadData" element={
          <ProtectedRoute allowedRoles={['admin']}>
          <UploadData />
          </ProtectedRoute>
          } />
        <Route path="/tambahpelanggan" element={
          <ProtectedRoute allowedRoles={['admin']}>
          <TambahPelanggan />
          </ProtectedRoute>
          } />
        <Route path="/editpelanggan/:pelanggan_id" element={
          <ProtectedRoute allowedRoles={['admin']}>
          <EditPelanggan />
          </ProtectedRoute>
          } />
        <Route path="/penjualan" element={
        <ProtectedRoute allowedRoles={['admin']}>
        <SalesManagement />
        </ProtectedRoute>
        } />
        <Route path="/pemesanan" element={<Pemesanan />} />
<Route path="/chatpelanggan" element={<ChatPelanggan />} />
<Route path="/faq" element={<FAQ />} />
<Route path="/artikel" element={<Artikel />} />
<Route path="/produk" element={<ProductManagement />} />
<Route path="/productform" element={<ProductForm />} />
<Route path="/setting" element={<SettingAkun/>}/>
      </Route>
    </Routes>
  );
}

export default App;
