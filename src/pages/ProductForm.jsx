import { useState } from "react";
import { BadgePercent, ImagePlus } from "lucide-react";

function ProductForm() {
  const [formData, setFormData] = useState({
    namaProduk: "",
    harga: "",
    deskripsi: "",
    gambar: "",
    promosi: false,
    diskon: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data Produk:", formData);
    alert("Data produk berhasil dikirim!");
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl max-w-2xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-orange-700 mb-6 flex items-center gap-2">
        <BadgePercent className="w-6 h-6" />
        Form Produk & Promosi
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nama Produk */}
        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">Nama Produk</label>
          <input
            type="text"
            name="namaProduk"
            value={formData.namaProduk}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            required
          />
        </div>

        {/* Harga */}
        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">Harga (Rp)</label>
          <input
            type="number"
            name="harga"
            value={formData.harga}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            required
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">Deskripsi</label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            rows={3}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        {/* Gambar */}
        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1 flex items-center gap-2">
            <ImagePlus className="w-4 h-4" />
            URL Gambar Produk
          </label>
          <input
            type="text"
            name="gambar"
            value={formData.gambar}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        {/* Checkbox Promosi */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="promosi"
            checked={formData.promosi}
            onChange={handleChange}
            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
          <label className="text-sm text-gray-700 font-medium">Aktifkan Promosi</label>
        </div>

        {/* Diskon */}
        {formData.promosi && (
          <div>
            <label className="block font-medium text-sm text-gray-700 mb-1">Diskon (%)</label>
            <input
              type="number"
              name="diskon"
              value={formData.diskon}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              min="0"
              max="100"
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-300"
          >
            Simpan Produk
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
