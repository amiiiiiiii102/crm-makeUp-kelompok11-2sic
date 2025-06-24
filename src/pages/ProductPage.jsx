import React, { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import ProductManagement from "./ProductManagement";
import { supabase } from "../supabase";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("produk").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Gagal mengambil data:", error);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ProductForm onAddProduct={handleAddProduct} />
      <div className="mt-10">
        {loading ? (
          <div className="text-center text-gray-500">Loading produk...</div>
        ) : (
          <ProductManagement products={products} setProducts={setProducts} />
        )}
      </div>
    </div>
  );
}

export default ProductPage;
