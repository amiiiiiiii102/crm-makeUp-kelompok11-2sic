import React, { useState, useRef } from "react";
import { ImagePlus, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "../supabase";

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
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const handleSubmit = async (e) => {
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

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("gambar-produk")
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      showMessage("error", "Gagal mengunggah gambar.");
      return;
    }

    const { data: imageUrlData } = supabase
      .storage
      .from("gambar-produk")
      .getPublicUrl(filePath);

    const newProduct = {
      name,
      price: Number(price),
      description,
      image: imageUrlData.publicUrl,
      promotion,
      discount: promotion ? parseInt(discount) : null,
      stock: true,
      status: "In Stock",
      is_new: true,
      is_restocked: false,
      rating: parsedRating,
    };

    const { error: insertError } = await supabase.from("produk").insert(newProduct);

    if (insertError) {
      console.error("Insert error:", insertError);
      showMessage("error", "Gagal menyimpan produk.");
      return;
    }

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
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showMessage("error", "Ukuran gambar maksimal 2MB!");
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 font-sans">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
        <span className="text-orange-500">🛍️</span> Tambah Produk Baru
      </h2>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
          <div className="font-medium">
            {message.type === "success" ? "Sukses: " : "Gagal: "}
            {message.text}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Produk <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama produk..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Harga (Rp) <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Contoh: 50000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Deskripsi <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan detail produk Anda..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Gambar Produk <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-orange-400 hover:text-orange-500 relative overflow-hidden group">
              {previewUrl ? (
                <img src={previewUrl} alt="preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <>
                  <ImagePlus className="w-8 h-8 mb-1" />
                  <span className="text-xs font-medium text-center">Unggah Gambar</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
              />
              {previewUrl && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-white text-sm">Ganti Gambar</span>
                </div>
              )}
            </label>
            <div className="text-sm text-gray-600">
              <p>Format: JPG, PNG, max 2MB</p>
              {imageFile && (
                <p className="mt-1 font-medium text-gray-700">Terpilih: {imageFile.name}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={promotion}
            onChange={(e) => setPromotion(e.target.checked)}
            className="h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
          />
          <label className="text-sm font-semibold text-gray-700">
            Aktifkan Promosi
          </label>
        </div>

        {promotion && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Diskon (%) <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Contoh: 20"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Rating Produk (1-5) <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
            type="number"
            step="0.1"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="Contoh: 4.5"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Simpan Produk
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
