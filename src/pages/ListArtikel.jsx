import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Pencil, Trash2, Search, FilePlus2, FileText } from 'lucide-react';

export default function ListArtikel() {
  const [artikels, setArtikels] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [stats, setStats] = useState({ total: 0, publish: 0, draft: 0, archived: 0 });
  const navigate = useNavigate();

  const fetchArtikels = async () => {
    const { data, error } = await supabase
      .from('artikel')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setArtikels(data);
      setStats({
        total: data.length,
        publish: data.filter(a => a.statusartikel === 'publish').length,
        draft: data.filter(a => a.statusartikel === 'draft').length,
        archived: data.filter(a => a.statusartikel === 'archived').length,
      });
    }
  };

  const deleteArtikel = async (id) => {
    const { error } = await supabase.from('artikel').delete().eq('id', id);
    if (!error) fetchArtikels();
  };

  useEffect(() => {
    fetchArtikels();
  }, []);

  const filtered = artikels.filter((a) =>
    a.judulartikel.toLowerCase().includes(search.toLowerCase()) &&
    (selectedKategori === '' || a.kategoriartikel === selectedKategori)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="flex justify-center mb-6">
            <FileText className="w-16 h-16 text-orange-200 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Manajemen <span className="text-orange-200">Artikel</span>
          </h1>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Kelola artikel informatif untuk pelanggan setia Istana Cosmetik.
          </p>
        </div>
      </div>

      {/* Konten */}
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Statistik */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(stats).map(([key, val]) => (
            <div key={key} className="bg-white p-6 rounded-2xl shadow text-center border border-orange-100">
              <p className="text-sm font-semibold text-orange-700">{key.toUpperCase()}</p>
              <p className="text-2xl font-bold text-orange-800">{val}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari judul artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-orange-200 rounded-full focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 text-gray-700 bg-orange-50"
            />
          </div>

          {/* Dropdown Kategori */}
          <div className="w-full md:w-1/3">
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-full focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 text-gray-700 bg-orange-50"
            >
              <option value="">Semua Kategori</option>
              <option value="Skincare">Skincare</option>
              <option value="Makeup">Makeup</option>
              <option value="Tips">Tips</option>
              <option value="Review">Review</option>
            </select>
          </div>

          {/* Tombol Tambah */}
          <button
            onClick={() => navigate('/tambah-artikel')}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-full text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <FilePlus2 className="w-4 h-4" /> Tambah Artikel
          </button>
        </div>

        {/* Tabel Artikel */}
        <div className="overflow-x-auto rounded-xl shadow-lg border border-orange-100">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-orange-100 text-orange-800">
              <tr>
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Judul</th>
                <th className="p-4 text-left">Gambar</th>
                <th className="p-4 text-left">Isi</th>
                <th className="p-4 text-left">Kategori</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-6 text-gray-500">Tidak ada artikel</td>
                </tr>
              ) : (
                filtered.map((artikel, i) => (
                  <tr key={artikel.id} className="border-t hover:bg-orange-50">
                    <td className="p-4">{i + 1}</td>
                    <td className="p-4 font-medium text-gray-800">{artikel.judulartikel}</td>
                    <td className="p-4">
                      <img
                        src={artikel.thumbnailartikel}
                        alt=""
                        className="w-24 h-20 object-cover rounded"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/fallback.png'; }}
                      />
                    </td>
                    <td className="p-4 text-gray-600">{artikel.isiartikel.slice(0, 100)}...</td>
                    <td className="p-4 text-orange-700 font-medium">
                      {artikel.kategoriartikel || '-'}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        artikel.statusartikel === 'publish' ? 'bg-green-100 text-green-700' :
                        artikel.statusartikel === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {artikel.statusartikel}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => navigate(`/edit-artikel/${artikel.id}`)}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => deleteArtikel(artikel.id)}
                        className="text-red-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
