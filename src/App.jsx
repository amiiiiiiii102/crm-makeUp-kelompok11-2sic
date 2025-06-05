import { Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";

import { Route } from "react-router-dom";
import Pelanggan from "./pages/Pelanggan";
import ProductManagement from "./pages/ProductManagement";
import SalesManagement from "./pages/SalesManagement";
import FAQ from "./pages/FAQ";
import ProductForm from "./pages/ProductForm";

function App(){
  return(
    <Routes>
      <Route element={<MainLayout/>}>
      <Route path="/" element={<Dashboard/>}/>
     
      <Route path="/pelanggan" element={<Pelanggan/>}/>
      

      <Route path="/produk" element={<ProductManagement/>}/>
      <Route path="/penjualan" element={<SalesManagement/>}/>
      <Route path="/ProductForm" element={<ProductForm/>}/>
      <Route path="/FAQ" element={<FAQ/>}></Route>
      </Route>
    </Routes>
  )
}

export default App;