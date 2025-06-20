import React, { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import ProductManagement from "./ProductManagement";

function ProductPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("products");
    if (stored) {
      setProducts(JSON.parse(stored));
    }
  }, []);

  const handleAddProduct = (newProduct) => {
    const updatedProducts = [newProduct, ...products];
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ProductForm onAddProduct={handleAddProduct} />
      <div className="mt-10">
        <ProductManagement products={products} />
      </div>
    </div>
  );
}

export default ProductPage;
