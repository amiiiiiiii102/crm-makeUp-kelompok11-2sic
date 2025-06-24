import { useState, useEffect } from 'react';

const ArtikelForm = ({ addArtikel, updateArtikel, editingArtikel }) => {
  const [form, setForm] = useState({
    judulartikel: '',
    thumbnailartikel: '',
    isiartikel: '',
    statusartikel: 'draft',
  });

  useEffect(() => {
    if (editingArtikel) {
      setForm({
        judulartikel: editingArtikel.judulartikel || '',
        thumbnailartikel: editingArtikel.thumbnailartikel || '',
        isiartikel: editingArtikel.isiartikel || '',
        statusartikel: editingArtikel.statusartikel || 'draft',
        id: editingArtikel.id,
      });
    } else {
      setForm({
        judulartikel: '',
        thumbnailartikel: '',
        isiartikel: '',
        statusartikel: 'draft',
      });
    }
  }, [editingArtikel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { judulartikel, thumbnailartikel, isiartikel, statusartikel } = form;

    if (!judulartikel || !thumbnailartikel || !isiartikel || !statusartikel) {
      alert("Semua field harus diisi");
      return;
    }

    if (editingArtikel) {
      await updateArtikel(form);
    } else {
      await addArtikel(form);
    }

    setForm({
      judulartikel: '',
      thumbnailartikel: '',
      isiartikel: '',
      statusartikel: 'draft',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded shadow-sm bg-white">
      <h2 className="text-lg font-semibold text-gray-800">
        {editingArtikel ? 'Edit Artikel' : 'Tambah Artikel'}
      </h2>
      <input
        type="text"
        placeholder="Judul Artikel"
        className="w-full p-2 border rounded"
        value={form.judulartikel}
        onChange={e => setForm({ ...form, judulartikel: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Link Gambar (thumbnail)"
        className="w-full p-2 border rounded"
        value={form.thumbnailartikel}
        onChange={e => setForm({ ...form, thumbnailartikel: e.target.value })}
        required
      />
      <textarea
        placeholder="Isi Artikel"
        className="w-full p-2 border rounded h-40"
        value={form.isiartikel}
        onChange={e => setForm({ ...form, isiartikel: e.target.value })}
        required
      />
      <select
        className="w-full p-2 border rounded"
        value={form.statusartikel}
        onChange={e => setForm({ ...form, statusartikel: e.target.value })}
      >
        <option value="draft">Draft</option>
        <option value="publish">Publish</option>
        <option value="archived">Archived</option>
      </select>
      <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
        {editingArtikel ? 'Perbarui Artikel' : 'Tambah Artikel'}
      </button>
    </form>
  );
};

export default ArtikelForm;
