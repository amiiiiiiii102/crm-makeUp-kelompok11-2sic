import React, { useState } from 'react';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

const initialArticles = [
  {
    id: 1,
    judulArtikel: 'Manfaat Skincare untuk Remaja',
    thumbnailArtikel: 'https://via.placeholder.com/80',
    isiArtikel: 'Penjelasan pentingnya skincare sejak usia muda.',
    statusArtikel: 'publish',
    created_at: '2025-06-20T10:00:00Z'
  },
  {
    id: 2,
    judulArtikel: 'Tips Memilih Sunscreen yang Tepat',
    thumbnailArtikel: 'https://via.placeholder.com/80',
    isiArtikel: 'Cara menentukan sunscreen sesuai jenis kulit.',
    statusArtikel: 'draft',
    created_at: '2025-06-18T08:30:00Z'
  }
];

const Artikel = () => {
  const [articles, setArticles] = useState(initialArticles);
  const [sortAsc, setSortAsc] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    judulArtikel: '',
    thumbnailArtikel: '',
    isiArtikel: '',
    statusArtikel: 'draft'
  });

  const toggleSort = () => setSortAsc(!sortAsc);

  const filteredArticles = articles
    .filter(a => filterStatus === 'all' || a.statusArtikel === filterStatus)
    .sort((a, b) => {
      if (sortAsc) return a.judulArtikel.localeCompare(b.judulArtikel);
      else return b.judulArtikel.localeCompare(a.judulArtikel);
    });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'publish': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      case 'archived': return 'bg-gray-100 text-gray-600';
      default: return '';
    }
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus artikel ini?')) {
      setArticles(articles.filter(a => a.id !== id));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      setArticles(articles.map(a => a.id === currentId ? { ...a, ...formData } : a));
    } else {
      const newArticle = {
        ...formData,
        id: Date.now(),
        created_at: new Date().toISOString()
      };
      setArticles([...articles, newArticle]);
    }

    // Reset
    setFormData({
      judulArtikel: '',
      thumbnailArtikel: '',
      isiArtikel: '',
      statusArtikel: 'draft'
    });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleEdit = (article) => {
    setFormData({
      judulArtikel: article.judulArtikel,
      thumbnailArtikel: article.thumbnailArtikel,
      isiArtikel: article.isiArtikel,
      statusArtikel: article.statusArtikel
    });
    setCurrentId(article.id);
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Artikel</h1>
            <p className="text-gray-600">Kelola konten artikel pada platform</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setIsEditing(false);
              setFormData({
                judulArtikel: '',
                thumbnailArtikel: '',
                isiArtikel: '',
                statusArtikel: 'draft'
              });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <Plus className="w-4 h-4" />
            {showForm && !isEditing ? 'Tutup Form' : 'Tambah Artikel'}
          </button>
        </div>

        {/* Form Tambah/Edit Artikel */}
        {showForm && (
          <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg shadow mb-6 space-y-4 border">
            <h2 className="text-lg font-semibold text-gray-800">{isEditing ? 'Edit Artikel' : 'Tambah Artikel Baru'}</h2>
            <input
              type="text"
              placeholder="Judul Artikel"
              className="w-full p-2 border rounded"
              value={formData.judulArtikel}
              onChange={(e) => setFormData({ ...formData, judulArtikel: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="URL Gambar Thumbnail"
              className="w-full p-2 border rounded"
              value={formData.thumbnailArtikel}
              onChange={(e) => setFormData({ ...formData, thumbnailArtikel: e.target.value })}
            />
            <textarea
              placeholder="Isi Artikel"
              className="w-full p-2 border rounded"
              rows={4}
              value={formData.isiArtikel}
              onChange={(e) => setFormData({ ...formData, isiArtikel: e.target.value })}
            />
            <select
              className="w-full p-2 border rounded"
              value={formData.statusArtikel}
              onChange={(e) => setFormData({ ...formData, statusArtikel: e.target.value })}
            >
              <option value="draft">Draft</option>
              <option value="publish">Publish</option>
              <option value="archived">Archived</option>
            </select>
            <div className="flex gap-2">
              <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                {isEditing ? 'Update' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setIsEditing(false);
                }}
                className="text-orange-700 border border-orange-600 px-4 py-2 rounded hover:bg-orange-50"
              >
                Batal
              </button>
            </div>
          </form>
        )}

        {/* Filter dan Sort */}
        <div className="mb-4 flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Semua Status</option>
            <option value="publish">Publish</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <button
            onClick={toggleSort}
            className="flex items-center gap-1 text-sm px-3 py-2 border rounded-lg bg-white hover:bg-gray-100"
          >
            Urutkan Judul {sortAsc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Tabel Artikel */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Thumbnail</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Judul</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Tanggal</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredArticles.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img src={a.thumbnailArtikel} alt={a.judulArtikel} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{a.judulArtikel}</p>
                    <p className="text-sm text-gray-500 truncate">{a.isiArtikel.slice(0, 60)}...</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(a.statusArtikel)}`}>
                      {a.statusArtikel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatDate(a.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(a)}
                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-red-600 hover:underline text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredArticles.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">Tidak ada artikel ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Artikel;
