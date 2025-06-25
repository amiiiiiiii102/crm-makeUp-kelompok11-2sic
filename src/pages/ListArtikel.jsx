import { useEffect, useState } from 'react';
import { supabase } from "../supabase";
import ArtikelForm from './ArtikelForm';

function ListArtikel() {
  const [artikels, setArtikels] = useState([]);
  const [editingArtikel, setEditingArtikel] = useState(null);

  const fetchArtikels = async () => {
    const { data, error } = await supabase
      .from('artikel')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setArtikels(data);
  };

  const addArtikel = async (artikel) => {
    const { error } = await supabase.from('artikel').insert([artikel]);
    if (error) {
      console.error("Gagal insert:", error);
      alert("Gagal menambah artikel. Lihat console.");
    } else {
      fetchArtikels();
    }
  };

  const updateArtikel = async (artikel) => {
    const { error } = await supabase
      .from('artikel')
      .update({
        judulartikel: artikel.judulartikel,
        thumbnailartikel: artikel.thumbnailartikel,
        isiartikel: artikel.isiartikel,
        statusartikel: artikel.statusartikel,
      })
      .eq('id', artikel.id);

    if (error) console.error(error);
    else {
      fetchArtikels();
      setEditingArtikel(null);
    }
  };

  const deleteArtikel = async (id) => {
    const { error } = await supabase.from('artikel').delete().eq('id', id);
    if (error) console.error(error);
    else fetchArtikels();
  };

  useEffect(() => {
    fetchArtikels();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manajemen Artikel</h1>

      <ArtikelForm
        addArtikel={addArtikel}
        updateArtikel={updateArtikel}
        editingArtikel={editingArtikel}
      />

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border text-sm bg-white rounded shadow">
          <thead>
            <tr className="bg-orange-100 text-left text-sm text-orange-700">
              <th className="p-3 border">#</th>
              <th className="p-3 border">Judul</th>
              <th className="p-3 border">Gambar</th>
              <th className="p-3 border">Isi</th>
              <th className="p-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {artikels.map((artikel, index) => (
              <tr key={artikel.id} className="hover:bg-orange-50">
                <td className="p-3 border">{index + 1}</td>
                <td className="p-3 border font-medium">{artikel.judulartikel}</td>
                <td className="p-3 border">
                  <img
                    src={artikel.thumbnailartikel}
                    alt="thumbnail"
                    className="w-40 h-32 object-contain rounded"
                  />
                </td>
                <td className="p-3 border text-gray-700">
                  {artikel.isiartikel?.length > 100
                    ? artikel.isiartikel.slice(0, 100) + '...'
                    : artikel.isiartikel}
                </td>
                <td className="p-3 border space-x-2">
                  <button
                    onClick={() => setEditingArtikel(artikel)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteArtikel(artikel.id)}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {artikels.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  Belum ada artikel
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListArtikel;
