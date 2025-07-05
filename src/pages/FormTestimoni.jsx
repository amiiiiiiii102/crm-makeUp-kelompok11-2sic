import { useState } from "react";
import { supabase } from "../supabase";

export default function FormTestimoni({ onSuccess }) {
  const [form, setForm] = useState({ nama: "", ulasan: "", foto: null });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setForm({ ...form, foto: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.foto) {
      alert("❗ Upload gambar dulu ya");
      setLoading(false);
      return;
    }

    // Generate nama file unik
    const fileExt = form.foto.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    // Upload ke Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("testimoni-foto")
      .upload(fileName, form.foto);

    if (uploadError) {
      alert("❌ Gagal upload gambar");
      setLoading(false);
      return;
    }

    // Simpan data ke tabel testimoni
    const { error: insertError } = await supabase
      .from("testimoni")
      .insert([
        {
          nama: form.nama,
          ulasan: form.ulasan,
          foto: fileName, // hanya nama file
        },
      ]);

    if (insertError) {
      alert("❌ Gagal simpan data testimoni");
    } else {
      alert("✅ Testimoni berhasil dikirim!");
      if (onSuccess) onSuccess(); // trigger refresh
      setForm({ nama: "", ulasan: "", foto: null });
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "0 auto",
        padding: 24,
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <h3 style={{ color: "#b4380d", marginBottom: 16 }}>Berikan Testimoni Anda</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <input
          type="text"
          name="nama"
          placeholder="Nama"
          value={form.nama}
          onChange={handleChange}
          required
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
        <textarea
          name="ulasan"
          placeholder="Ulasan"
          value={form.ulasan}
          onChange={handleChange}
          required
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
            resize: "vertical",
            minHeight: 80,
          }}
        />
        <input
          type="file"
          name="foto"
          accept="image/*"
          onChange={handleChange}
          required
          style={{ fontSize: 14 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#f37021",
            color: "#fff",
            padding: "10px",
            border: "none",
            borderRadius: 8,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Mengirim..." : "Kirim"}
        </button>
      </form>
    </div>
  );
}
