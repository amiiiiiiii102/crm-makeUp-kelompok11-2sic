import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
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
    console.log("Data yang dikirim:", artikel);
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
        statusartikel: artikel.statusartikel
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
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRUD Artikel dengan Supabase</h1>
      <ArtikelForm
        addArtikel={addArtikel}
        updateArtikel={updateArtikel}
        editingArtikel={editingArtikel}
      />
      <ul className="mt-4 space-y-4">
        {artikels.map((artikel) => (
          <li key={artikel.id} className="border p-4 rounded shadow-sm bg-white">
            <div>
              <p className="font-semibold text-lg">{artikel.judulartikel}</p>
              <p className="text-sm text-gray-600 mb-1">{artikel.statusartikel}</p>
              <img
                src={artikel.thumbnailartikel}
                alt="Thumbnail"
                className="w-full h-40 object-cover rounded mb-2"
              />
              <p className="text-sm text-gray-700">{artikel.isiartikel}</p>
            </div>
            <div className="mt-2 flex space-x-4">
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListArtikel;
