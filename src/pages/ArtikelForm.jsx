import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { ArrowLeft } from "lucide-react";

const ArtikelForm = ({ mode = "tambah", artikelId }) => {
  const [form, setForm] = useState({
    judulartikel: "",
    thumbnailartikel: "",
    isiartikel: "",
    statusartikel: "draft",
    kategoriartikel: "", // kategori baru
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (mode === "edit" && artikelId) {
      const fetchData = async () => {
        const { data, error } = await supabase
          .from("artikel")
          .select("*")
          .eq("id", artikelId)
          .single();

        if (!error && data) {
          setForm({
            judulartikel: data.judulartikel,
            thumbnailartikel: data.thumbnailartikel,
            isiartikel: data.isiartikel,
            statusartikel: data.statusartikel,
            kategoriartikel: data.kategoriartikel || "", // ambil kategori kalau ada
          });
        }
      };
      fetchData();
    }
  }, [mode, artikelId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      judulartikel,
      thumbnailartikel,
      isiartikel,
      statusartikel,
      kategoriartikel,
    } = form;

    if (!judulartikel || !thumbnailartikel || !isiartikel || !statusartikel || !kategoriartikel) {
      alert("Semua field harus diisi");
      return;
    }

    const dataPayload = {
      judulartikel,
      thumbnailartikel,
      isiartikel,
      statusartikel,
      kategoriartikel,
    };
    let error;

    if (mode === "edit") {
      ({ error } = await supabase
        .from("artikel")
        .update(dataPayload)
        .eq("id", artikelId));
    } else {
      ({ error } = await supabase.from("artikel").insert([dataPayload]));
    }

    if (error) {
      alert("Gagal menyimpan data");
      console.error(error);
    } else {
      alert("Artikel berhasil disimpan!");
      navigate("/listartikel");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-orange-700">
            {mode === "edit" ? "✏️ Edit Artikel" : "➕ Tambah Artikel"}
          </h2>
          <button
            type="button"
            onClick={() => navigate("/listartikel")}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-800 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium text-orange-800">Judul Artikel</label>
            <input
              type="text"
              className="w-full border border-orange-200 p-3 rounded-xl bg-orange-50 focus:ring-2 focus:ring-orange-300 outline-none"
              placeholder="Judul artikel..."
              value={form.judulartikel}
              onChange={(e) => setForm({ ...form, judulartikel: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-orange-800">Link Thumbnail</label>
            <input
              type="text"
              className="w-full border border-orange-200 p-3 rounded-xl bg-orange-50 focus:ring-2 focus:ring-orange-300 outline-none"
              placeholder="https://image-url.com/thumbnail.jpg"
              value={form.thumbnailartikel}
              onChange={(e) => setForm({ ...form, thumbnailartikel: e.target.value })}
            />
          </div>

          {form.thumbnailartikel && (
            <div className="w-full h-48 rounded-lg overflow-hidden border border-orange-100">
              <img
                src={form.thumbnailartikel}
                alt="Preview Thumbnail"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/fallback.png";
                }}
              />
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium text-orange-800">Kategori Artikel</label>
            <select
              className="w-full border border-orange-200 p-3 rounded-xl bg-orange-50 focus:ring-2 focus:ring-orange-300 outline-none"
              value={form.kategoriartikel}
              onChange={(e) => setForm({ ...form, kategoriartikel: e.target.value })}
            >
              <option value="">Pilih Kategori</option>
              <option value="Tips">Tips</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Produk">Produk</option>
              <option value="Review">Review</option>
              <option value="Berita">Berita</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-orange-800">Isi Artikel</label>
            <textarea
              rows="6"
              className="w-full border border-orange-200 p-3 rounded-xl bg-orange-50 focus:ring-2 focus:ring-orange-300 outline-none"
              placeholder="Isi artikel..."
              value={form.isiartikel}
              onChange={(e) => setForm({ ...form, isiartikel: e.target.value })}
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 font-medium text-orange-800">Status Artikel</label>
            <select
              className="w-full border border-orange-200 p-3 rounded-xl bg-orange-50 focus:ring-2 focus:ring-orange-300 outline-none"
              value={form.statusartikel}
              onChange={(e) => setForm({ ...form, statusartikel: e.target.value })}
            >
              <option value="draft">Draft</option>
              <option value="publish">Publish</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg"
            >
              {mode === "edit" ? "💾 Simpan Perubahan" : "✅ Tambah Artikel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArtikelForm;
