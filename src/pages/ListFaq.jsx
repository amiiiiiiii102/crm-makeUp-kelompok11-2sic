import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import FormFaq from './FormFaq';
import { FileText, FilePlus2, Pencil, Trash2, Search } from 'lucide-react';

export default function ListFaq() {
  const [faqList, setFaqList] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchFaq = async () => {
    const { data, error } = await supabase.from('faq').select('*').order('created_at', { ascending: false });
    if (!error) {
      setFaqList(data);
    } else {
      console.error(error);
    }
  };

  const addUser = async (faq) => {
    const { error } = await supabase.from('faq').insert(faq);
    if (!error) {
      fetchFaq();
      setShowForm(false);
    } else {
      console.error(error);
    }
  };

  const updateUser = async (faq) => {
    const { error } = await supabase.from('faq').update(faq).eq('id', faq.id);
    if (!error) {
      fetchFaq();
      setEditingUser(null);
      setShowForm(false);
    } else {
      console.error(error);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm('Yakin ingin menghapus pertanyaan ini?');
    if (!confirmDelete) return;

    const { error } = await supabase.from('faq').delete().eq('id', id);
    if (!error) fetchFaq();
  };

  useEffect(() => {
    fetchFaq();
  }, []);

  const filtered = faqList.filter((f) =>
    f.pertanyaan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="flex justify-center mb-6">
            <FileText className="w-16 h-16 text-orange-200 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Manajemen <span className="text-orange-200">FAQ</span>
          </h1>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Kelola daftar pertanyaan yang sering diajukan pelanggan agar pengalaman mereka jadi lebih lancar.
          </p>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Search & Tambah */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-orange-200 rounded-full focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 text-gray-700 bg-orange-50"
            />
          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingUser(null);
            }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-full text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <FilePlus2 className="w-4 h-4" />
            {showForm ? "Tutup Form" : "Tambah FAQ"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8">
            <FormFaq
              addUser={addUser}
              updateUser={updateUser}
              editingUser={editingUser}
            />
          </div>
        )}

        {/* Tabel FAQ */}
        <div className="overflow-x-auto rounded-xl shadow-lg border border-orange-100">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-orange-100 text-orange-800">
              <tr>
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Pertanyaan</th>
                <th className="p-4 text-left">Jawaban</th>
                <th className="p-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-500">
                    Tidak ada pertanyaan ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((faq, i) => (
                  <tr key={faq.id} className="border-t hover:bg-orange-50">
                    <td className="p-4">{i + 1}</td>
                    <td className="p-4 font-medium text-gray-800">{faq.pertanyaan}</td>
                    <td className="p-4 text-gray-600">{faq.jawaban}</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingUser(faq);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => deleteUser(faq.id)}
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
