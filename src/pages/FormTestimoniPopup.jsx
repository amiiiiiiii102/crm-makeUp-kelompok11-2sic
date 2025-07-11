import React, { useState } from "react";
import { supabase } from "../supabase";
import { XCircle, Star, Image } from "lucide-react";

const FormTestimoniPopup = ({ show, onClose, pesanan }) => {
  const [ulasan, setUlasan] = useState("");
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    const userId = user?.id;

    if (!pesanan || !userId) {
      alert("Gagal mengirim testimoni: data tidak lengkap.");
      setLoading(false);
      return;
    }

    // 1️⃣ Auto insert ke tabel pelanggan (jika belum ada)
    const { data: pelanggan, error: pelangganError } = await supabase
      .from("pelanggan")
      .select("id")
      .eq("id", userId)
      .single();

    if (!pelanggan && !pelangganError) {
      await supabase.from("pelanggan").insert({
        id: userId,
        nama: user.user_metadata?.full_name || user.email?.split("@")[0] || "Anonim",
        email: user.email,
      });
    }

    // 2️⃣ Upload foto ke storage (jika ada)
    let fotoUrl = null;
    if (foto) {
      const fileName = `foto-${Date.now()}-${foto.name}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from("testimoni-foto")
        .upload(fileName, foto);

      if (uploadError) {
        alert("Gagal mengunggah foto.");
        setLoading(false);
        return;
      }

      const { data: publicUrl } = supabase
        .storage
        .from("testimoni-foto")
        .getPublicUrl(uploadData.path);
      fotoUrl = publicUrl.publicUrl;
    }

    // 3️⃣ Simpan testimoni ke database
    const { error } = await supabase.from("testimoni").insert([{
      id_user: userId,
      id_pesanan: pesanan.id_pesanan,
      ulasan,
      foto: fotoUrl,
      rating,
      created_at: new Date(),
    }]);

    setLoading(false);

    if (error) {
      alert("Gagal mengirim testimoni.");
    } else {
      alert("Testimoni berhasil dikirim!");
      setUlasan("");
      setFoto(null);
      setFotoPreview(null);
      setRating(0);
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          <XCircle className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-orange-700 mb-4">
          Tulis Testimoni
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Tulis pengalaman kamu..."
            value={ulasan}
            onChange={(e) => setUlasan(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-orange-500"
          ></textarea>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beri Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <Star
                  key={value}
                  onClick={() => handleRatingClick(value)}
                  className={`w-6 h-6 cursor-pointer ${
                    value <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Upload Foto (opsional)</label>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200">
              <Image className="w-4 h-4" />
              Pilih Foto
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="hidden"
              />
            </label>

            {fotoPreview && (
              <img
                src={fotoPreview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg mt-2 border"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 w-full"
          >
            {loading ? "Mengirim..." : "Kirim Testimoni"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormTestimoniPopup;
