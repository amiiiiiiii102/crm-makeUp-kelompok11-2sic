import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Search, Users } from 'lucide-react';

export default function TestimoniList() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    const { data: testimoniData, error } = await supabase
      .from('testimoni')
      .select(`*, users:users(id, email), pesanan:pesanan(id_pesanan, produk:produk(name))`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Gagal ambil testimoni:', error);
      return;
    }

    const combined = testimoniData.map((item) => ({
      ...item,
      email: item.users?.email || '-',
      nama_produk: item.pesanan?.produk?.name || '-',
    }));

    setData(combined);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) =>
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nama_produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ulasan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="flex justify-center mb-6">
            <Users className="w-16 h-16 text-orange-200 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Testimoni <span className="text-orange-200">Pelanggan</span>
          </h1>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Lihat ulasan jujur dari pelanggan kami yang telah mencoba produk Istana Cosmetik.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari email, produk, atau ulasan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-orange-200 rounded-full focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 text-gray-700 bg-orange-50"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow-lg border border-orange-100">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-orange-100 text-orange-800">
              <tr>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Produk</th>
                <th className="p-4 text-left">Ulasan</th>
                <th className="p-4 text-left">Rating</th>
                <th className="p-4 text-left">ID User</th>
                <th className="p-4 text-left">ID Pesanan</th>
                <th className="p-4 text-left">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-6 text-gray-500">Tidak ada testimoni ditemukan.</td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-orange-50">
                    <td className="p-4">{item.email}</td>
                    <td className="p-4">{item.nama_produk}</td>
                    <td className="p-4">{item.ulasan}</td>
                    <td className="p-4">{Array.from({ length: item.rating || 0 }).map((_, i) => '⭐')}</td>
                    <td className="p-4">{item.id_user}</td>
                    <td className="p-4">{item.id_pesanan}</td>
                    <td className="p-4">{new Date(item.created_at).toLocaleString('id-ID')}</td>
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
