import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ImagePlus, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "../supabase";

const ProductEditForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;

  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    originalPrice: "", // Keep as string for input type="text"
    price: "", // Keep as string for input type="text"
    description: "",
    imageFile: null,
    discount: "", // Keep as string for input type="text"
    rating: "", // Keep as string for input type="text"
    status: "In Stock",
    tag: "none",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!product) {
      navigate("/produk");
      return;
    }

    const createdAt = new Date(product.created_at);
    const now = new Date();
    const isNew = (now - createdAt) / (1000 * 60 * 60 * 24) <= 1;
    const tag = isNew ? "new" : product.is_restocked ? "restocked" : "none";

    setFormData({
      name: product.name || "",
      originalPrice: (product.original_price || product.price || 0).toString(), // Convert to string
      price: (product.price || 0).toString(), // Convert to string
      description: product.description || "",
      imageFile: null,
      discount: (product.discount || 0).toString(), // Convert to string
      rating: (product.rating || 0).toString(), // Convert to string
      status: product.status || "In Stock",
      tag,
    });
    setPreviewUrl(product.image || null);
  }, [product, navigate]);

  // Effect to calculate price based on original_price and discount
  useEffect(() => {
    const originalPriceNum = parseFloat(formData.originalPrice);
    const discountNum = parseFloat(formData.discount);

    if (!isNaN(originalPriceNum) && originalPriceNum > 0 && !isNaN(discountNum) && discountNum > 0) {
      const discounted = originalPriceNum * (1 - discountNum / 100);
      setFormData((prev) => ({ ...prev, price: Math.round(discounted).toString() })); // Convert back to string
    } else {
      setFormData((prev) => ({ ...prev, price: originalPriceNum.toString() })); // Convert back to string
    }
  }, [formData.discount, formData.originalPrice]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFormData({ ...formData, imageFile: null });
      setPreviewUrl(product.image || null);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showMessage("error", "Ukuran gambar maksimal 2MB!");
      setFormData({ ...formData, imageFile: null });
      setPreviewUrl(product.image || null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setFormData({ ...formData, imageFile: file });
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic Validations - Parse values here for validation
    const parsedOriginalPrice = parseFloat(formData.originalPrice);
    const parsedDiscount = parseFloat(formData.discount);
    const parsedRating = parseFloat(formData.rating);

    if (!formData.name || !formData.originalPrice || !formData.description || !formData.rating) {
      showMessage("error", "Mohon lengkapi semua inputan yang diperlukan.");
      setIsLoading(false);
      return;
    }

    if (isNaN(parsedOriginalPrice) || parsedOriginalPrice <= 0) {
      showMessage("error", "Harga awal harus berupa angka lebih dari 0.");
      setIsLoading(false);
      return;
    }

    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      showMessage("error", "Rating harus berupa angka antara 1 hingga 5.");
      setIsLoading(false);
      return;
    }

    if (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
      showMessage("error", "Diskon harus berupa angka antara 0 hingga 100%.");
      setIsLoading(false);
      return;
    }

    let imageUrl = product.image;

    try {
      if (formData.imageFile) {
        const ext = formData.imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("gambar-produk")
          .upload(fileName, formData.imageFile);

        if (uploadError) throw new Error("Gagal mengunggah gambar.");

        const { data: imageData } = supabase.storage
          .from("gambar-produk")
          .getPublicUrl(fileName);

        imageUrl = imageData.publicUrl;
      }

      const createdAtDate = new Date(product.created_at);
      const now = new Date();
      const isStillNew = (now - createdAtDate) / (1000 * 60 * 60 * 24) <= 1;

      const { error } = await supabase
        .from("produk")
        .update({
          name: formData.name,
          price: parseFloat(formData.price), // Parse price to number
          original_price: parsedOriginalPrice, // Parse originalPrice to number
          description: formData.description,
          discount: parsedDiscount, // Parse discount to number
          rating: parsedRating, // Parse rating to number
          status: formData.status,
          is_new: isStillNew,
          is_restocked: formData.tag === "restocked",
          image: imageUrl,
        })
        .eq("id_produk", product.id_produk);

      if (error) throw new Error("Gagal memperbarui data produk.");

      showMessage("success", "Produk berhasil diperbarui!");
      setTimeout(() => navigate("/produk"), 1500);
    } catch (err) {
      console.error(err);
      showMessage("error", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-lg">
        Memuat data produk atau produk tidak ditemukan...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 font-sans">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
        <span className="text-orange-500">✏️</span> Edit Data Produk
      </h2>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 animate-fade-in ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500" />
          )}
          <div className="font-medium">
            {message.type === "success" ? "Sukses: " : "Gagal: "}
            {message.text}
          </div>
        </div>
      )}

      <form className="grid gap-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Produk <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Masukkan nama produk..."
            required
          />
        </div>

        <div>
          <label htmlFor="originalPrice" className="block text-sm font-semibold text-gray-700 mb-2">
            Harga Awal (Rp) <span className="text-red-500">*</span>
          </label>
          <input
            id="originalPrice"
            // type="number" // <--- CHANGED THIS LINE
            type="text" // Use text or tel to remove spin buttons
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800"
            value={formData.originalPrice}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value) || value === '') {
                setFormData({ ...formData, originalPrice: value });
              }
            }}
            placeholder="Contoh: 50000"
            required
          />
        </div>

        <div>
          <label htmlFor="discount" className="block text-sm font-semibold text-gray-700 mb-2">
            Diskon (%)
          </label>
          <input
            id="discount"
            // type="number" // <--- CHANGED THIS LINE
            type="text" // Use text or tel to remove spin buttons
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800"
            value={formData.discount}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value) || value === '') {
                setFormData({ ...formData, discount: value });
              }
            }}
            placeholder="Contoh: 10 (untuk 10%)"
          />
        </div>

        {/* Displaying calculated price (read-only) */}
        <div>
          <label htmlFor="calculatedPrice" className="block text-sm font-semibold text-gray-700 mb-2">
            Harga Setelah Diskon (Rp)
          </label>
          <input
            id="calculatedPrice"
            type="text" // Still type text as it's read-only calculated value
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 cursor-not-allowed"
            value={formData.price}
            readOnly
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            Deskripsi <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Jelaskan detail produk Anda..."
            required
          />
        </div>

        <div>
          <label htmlFor="image-upload" className="block text-sm font-semibold text-gray-700 mb-2">
            Gambar Produk
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label
              htmlFor="image-upload"
              className="flex-shrink-0 w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-orange-400 hover:text-orange-500 transition-colors duration-200 relative overflow-hidden group"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <ImagePlus className="w-8 h-8 mb-2" />
                  <span className="text-xs text-center font-medium">Unggah/Ganti Gambar</span>
                </>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
              />
              {previewUrl && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-white text-sm font-semibold">Ganti Gambar</span>
                </div>
              )}
            </label>
            <div className="text-gray-500 text-sm">
              <p>Format: JPG, PNG, GIF</p>
              <p>Ukuran maksimal: 2MB</p>
              {formData.imageFile && <p className="mt-1 text-gray-700 font-medium">File baru dipilih: {formData.imageFile.name}</p>}
              {!formData.imageFile && product?.image && <p className="mt-1 text-gray-700 font-medium">Gambar saat ini: <a href={product.image} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Lihat</a></p>}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-semibold text-gray-700 mb-2">
            Rating Produk (1-5) <span className="text-red-500">*</span>
          </label>
          <input
            id="rating"
            // type="number" // <--- CHANGED THIS LINE
            type="text" // Use text or tel to remove spin buttons
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800"
            value={formData.rating}
            onChange={(e) => {
              const value = e.target.value.replace(',', '.'); // Replace comma with dot
              if (/^\d*\.?\d*$/.test(value) || value === '') {
                setFormData({ ...formData, rating: value });
              }
            }}
            placeholder="Contoh: 4.5"
            required
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
            Status Stok
          </label>
          <select
            id="status"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800 appearance-none bg-white pr-8"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        {/* Displaying 'is_new' and 'is_restocked' based on your 'tag' logic */}
        {formData.tag === "new" && (
            <div className="flex items-center space-x-3">
            <input
                id="is-new-display"
                type="checkbox"
                checked={true}
                readOnly
                className="form-checkbox h-5 w-5 text-orange-600 rounded cursor-not-allowed"
            />
            <label htmlFor="is-new-display" className="text-sm font-semibold text-gray-700">
                Produk Baru (Kurang dari 24 jam)
            </label>
            </div>
        )}

        {formData.tag === "restocked" && (
            <div className="flex items-center space-x-3">
            <input
                id="is-restocked-display"
                type="checkbox"
                checked={true}
                readOnly
                className="form-checkbox h-5 w-5 text-indigo-600 rounded cursor-not-allowed"
            />
            <label htmlFor="is-restocked-display" className="text-sm font-semibold text-gray-700">
                Produk Restok
            </label>
            </div>
        )}

        <button
          type="submit"
          className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {isLoading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
};

export default ProductEditForm;