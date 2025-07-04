// App.jsx

import Home from "./components/home/Home";
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import HalamanChatPelanggan from "./pages/HalamanChatPelanggan";
import Pelanggan from "./pages/pelanggan/Pelanggan";
import TambahPelanggan from "./pages/pelanggan/TambahPelanggan";
import EditPelanggan from "./pages/pelanggan/EditPelanggan";
import ProductManagement from "./pages/ProductManagement";
import ProductUser from "./pages/ProductUser";
import SalesManagement from "./pages/SalesManagement";
import ProductForm from "./pages/ProductForm";
import ProductEditForm from "./pages/ProductEditForm";
import AdminOrders from "./pages/AdminOrders";
import ProductPage from "./pages/ProductPage";
import ChatUser from "./pages/ChatUser";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./route/ProtectedRoute";
import PublicRoute from "./route/PublicRoute";
import NotFound from "./pages/NotFound";
import UploadData from "./pages/pelanggan/UploadData";
import SettingAkun from "./pages/auth/SettingAkun";
import InfoPemesananPelanggan from "./pages/InfoPemesananPelanggan";
import Produk from "./components/home/Produk";
import Testimoni from "./components/home/Testimoni";
import Kontak from "./components/home/Kontak";
import Artikel from "./components/home/Artikel"
import FAQ from "./components/home/Faq"
import ListPemesanan from "./pages/ListPemesanan";
import FormFaq from "./pages/FormFaq";
import ListFaq from "./pages/ListFaq";
import ListArtikel from "./pages/ListArtikel";
import ArtikelForm from "./pages/ArtikelForm";
import TestimoniList from "./pages/TestimoniList";
import ListFaqPelanggan from "./pages/ListFaqPelanggan";

function App() {
  return (
    <Routes>
      {/* Halaman publik */}
      <Route path="/" element={<Home />} />
      <Route path="/produk" element={<Produk />} />
      <Route path="/testimoni" element={<Testimoni />} />
      <Route path="/artikel" element={<Artikel />} />
      <Route path="/kontak" element={<Kontak />} />
      <Route path="/faq" element={<FAQ />} />
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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/InfoPemesananPelanggan"
          element={
            <ProtectedRoute allowedRoles={["pelanggan"]}>
              <InfoPemesananPelanggan/>
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
          path="/uploadData"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UploadData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/produkmanagement"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ProductManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/produkuser"
          element={
            <ProtectedRoute allowedRoles={["pelanggan"]}>
              <ProductUser />
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
        <Route
          path="/productform"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/produk"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ProductEditForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productpage"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ProductPage />
            </ProtectedRoute>
          }
        />
       
        
        <Route
  path="/listpemesanan"
  element={
    <ProtectedRoute allowedRoles={["pelanggan"]}>
      <ListPemesanan />
    </ProtectedRoute>
  }
/>

        <Route
          path="/AdminOrders"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatpelanggan"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <HalamanChatPelanggan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatuser"
          element={
            <ProtectedRoute allowedRoles={["pelanggan"]}>
              <ChatUser />
            </ProtectedRoute>
          }
        />
        <Route path="/formfaq" element={<FormFaq />} />
        <Route path="/listfaq" element={<ListFaq />} />
        <Route path="/ListFaqPelanggan" element={<ListFaqPelanggan />} />
        <Route path="/listartikel" element={<ListArtikel />} />
        <Route path="/listtestimoni" element={<TestimoniList />} />
        <Route path="/formartikel" element={<ArtikelForm />} />
        <Route path="/setting" element={<SettingAkun />} />
      </Route>
    </Routes>
  );
}

export default App;
