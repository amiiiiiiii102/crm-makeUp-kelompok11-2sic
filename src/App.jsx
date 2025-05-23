import { Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import { Route } from "react-router-dom";
import ProductManagement from "./pages/ProductManagement";

function App(){
  return(
    <Routes>
      <Route element={<MainLayout/>}>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/produk" element={<ProductManagement/>}/>
      </Route>
    </Routes>
  )
}

export default App;