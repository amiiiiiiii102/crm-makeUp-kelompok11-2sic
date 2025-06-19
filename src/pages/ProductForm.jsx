import React, { useState, useRef } from "react";
import { ImagePlus } from "lucide-react";

function ProductForm() {
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
      showMessage("error", "Mohon lengkapi semua inputan yang diperlukan!");
      return;
    }

    if (Number(price) <= 0) {
      showMessage("error", "Harga harus lebih dari 0!");
      return;
    }

    if (!imageFile) {
      showMessage("error", "Gambar produk wajib diunggah!");
      return;
    }

    if (imageFile.size > 2 * 1024 * 1024) {
      showMessage("error", "Ukuran gambar maksimal 2MB!");
      return;
    }

    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      showMessage("error", "Rating harus berupa angka antara 1 hingga 5.");
      return;
    }

    if (promotion) {
      const parsedDiscount = parseInt(discount);
      if (isNaN(parsedDiscount) || parsedDiscount < 1 || parsedDiscount > 100) {
        showMessage("error", "Diskon harus antara 1 hingga 100%");
        return;
      }
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;

      const newProduct = {
        id: Date.now(),
        name,
        price: formatRupiah(price),
        description,
        imageBase64: base64Image,
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

        showMessage("success", "Produk berhasil ditambahkan!");
      } catch (err) {
        console.error("Gagal menyimpan ke localStorage:", err);
        showMessage("error", "Terjadi kesalahan saat menyimpan produk.");
      }
    };
    reader.readAsDataURL(imageFile);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">🛍️ Tambah Produk Baru</h2>

      {message.text && (
        <div
          className={`mb-4 p-3 border-l-4 rounded-md ${
            message.type === "success"
              ? "bg-green-100 border-green-500 text-green-700"
              : "bg-red-100 border-red-500 text-red-700"
          }`}
        >
          <strong>
            {message.type === "success" ? "✅ Sukses: " : "❌ Gagal: "}
          </strong>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-medium">Nama Produk</label>
          <input
            className="w-full p-3 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Harga (Rp)</label>
          <input
            className="w-full p-3 border rounded"
            value={price}
            type="number"
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Deskripsi</label>
          <textarea
            className="w-full p-3 border rounded"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">🖼️ Gambar Produk</label>
          <div className="flex gap-3 items-center">
            <label className="bg-orange-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-orange-700">
              <ImagePlus className="inline w-4 h-4" />
              <span className="ml-2">Pilih Gambar</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
              />
            </label>
            {previewUrl && <img src={previewUrl} alt="preview" className="w-16 h-16 rounded border" />}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={promotion}
            onChange={(e) => setPromotion(e.target.checked)}
          />
          Aktifkan Promosi
        </label>
        {promotion && (
          <div>
            <label className="text-sm font-medium">Diskon (%)</label>
            <input
              className="w-full p-3 border rounded"
              value={discount}
              type="number"
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
        )}
        <div>
          <label className="text-sm font-medium">Rating Produk (1-5)</label>
          <input
            className="w-full p-3 border rounded"
            value={rating}
            type="number"
            step="0.1"
            min={1}
            max={5}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-3 rounded hover:bg-orange-700 transition"
        >
          Simpan Produk
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
