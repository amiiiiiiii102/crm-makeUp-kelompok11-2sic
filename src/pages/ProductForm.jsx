import React, { useState, useRef } from "react";
import { ImagePlus } from "lucide-react";

function ProductForm({ onAddProduct }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [promotion, setPromotion] = useState(false);
  const [discount, setDiscount] = useState("");
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const formatRupiah = (num) => `Rp ${Number(num).toLocaleString("id-ID")}`;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price || !description || !rating || (promotion && !discount)) {
      showMessage("error", "⚠️ Mohon lengkapi semua inputan yang diperlukan!");
      return;
    }

    if (Number(price) <= 0) {
      showMessage("error", "⚠️ Harga harus lebih dari 0!");
      return;
    }

    if (!imageFile) {
      showMessage("error", "⚠️ Gambar produk wajib diunggah!");
      return;
    }

    if (imageFile.size > 2 * 1024 * 1024) {
      showMessage("error", "⚠️ Ukuran gambar maksimal 2MB!");
      return;
    }

    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      showMessage("error", "⚠️ Rating harus berupa angka antara 1 hingga 5.");
      return;
    }

    if (promotion) {
      const parsedDiscount = parseInt(discount);
      if (isNaN(parsedDiscount) || parsedDiscount < 1 || parsedDiscount > 100) {
        showMessage("error", "⚠️ Diskon harus antara 1 hingga 100%");
        return;
      }
    }

    const newProduct = {
      id: Date.now(),
      name,
      price: formatRupiah(price),
      description,
      imageName: imageFile.name, // hanya menyimpan nama file
      promotion,
      discountPercent: promotion ? Number(discount) : null,
      stock: true,
      status: "In Stock",
      isNew: true,
      isRestocked: false,
      rating: parsedRating,
    };

    try {
      const existing = JSON.parse(localStorage.getItem("products") || "[]");
      const updated = [newProduct, ...existing];
      localStorage.setItem("products", JSON.stringify(updated));
      onAddProduct(newProduct);

      // Reset form
      setName("");
      setPrice("");
      setDescription("");
      setImageFile(null);
      setPreviewUrl(null);
      setPromotion(false);
      setDiscount("");
      setRating("");
      fileInputRef.current.value = null;

      showMessage("success", "✅ Produk berhasil ditambahkan!");
    } catch (err) {
      console.error("❌ Gagal menyimpan ke localStorage:", err);
      showMessage("error", "❌ Gagal menyimpan produk.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center flex items-center gap-2 justify-center">
        🛍️ Tambah Produk Baru
      </h2>

      {message.text && (
        <div
          className={`mb-4 p-3 border rounded-lg text-center ${
            message.type === "success"
              ? "bg-green-100 border-green-400 text-green-700"
              : "bg-yellow-100 border-yellow-400 text-yellow-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Nama Produk</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Harga (Rp)</label>
          <input
            type="number"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">🖼️ Gambar Produk</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg cursor-pointer hover:bg-orange-700 transition">
              <ImagePlus className="w-4 h-4" />
              <span>Pilih Gambar</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </label>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg border"
              />
            )}
          </div>
        </div>

        <label className="flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            checked={promotion}
            onChange={(e) => setPromotion(e.target.checked)}
            className="mr-2 w-4 h-4 text-orange-600 border-gray-300 rounded"
          />
          Aktifkan Promosi
        </label>

        {promotion && (
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Diskon (%)</label>
            <input
              type="number"
              min={1}
              max={100}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
        )}

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Rating Produk (1 - 5)</label>
          <input
            type="number"
            min={1}
            max={5}
            step={0.1}
            placeholder="Masukkan angka antara 1 sampai 5"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Simpan Produk
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
