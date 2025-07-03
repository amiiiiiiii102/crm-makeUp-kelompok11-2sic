import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { supabase } from '../supabase';

const PemesananPelanggan = () => {
  const [produk, setProduk] = useState([]);
  const [keranjang, setKeranjang] = useState([]);

  useEffect(() => {
    fetchProduk();
  }, []);

  const fetchProduk = async () => {
    const { data, error } = await supabase.from('produk').select('*');
    if (!error) setProduk(data);
  };

  const tambahKeKeranjang = (item) => {
    setKeranjang(prev => [...prev, item]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Pemesanan Produk</h1>
          <div className="flex items-center space-x-2 text-blue-600">
            <ShoppingCart size={20} />
            <span>{keranjang.length} item</span>
          </div>
        </div>

        {/* Daftar Produk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produk.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow p-4 border border-gray-200 flex flex-col">
              <img
                src={item.gambar_url || '/default.jpg'}
                alt={item.nama}
                className="h-40 w-full object-cover rounded-lg mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-900">{item.nama}</h2>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.deskripsi}</p>
              <p className="text-blue-600 font-bold mt-2">Rp {item.harga?.toLocaleString()}</p>
              <button
                onClick={() => tambahKeKeranjang(item)}
                className="mt-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Pesan Sekarang
              </button>
            </div>
          ))}
        </div>

        {/* Keranjang / Ringkasan */}
        {keranjang.length > 0 && (
          <div className="mt-10 bg-white p-6 rounded-xl shadow border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Keranjang Anda</h3>
            <ul className="divide-y divide-gray-200">
              {keranjang.map((item, i) => (
                <li key={i} className="py-3 flex items-center justify-between">
                  <span>{item.nama}</span>
                  <span className="text-blue-600 font-medium">Rp {item.harga?.toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="text-right mt-4">
              <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center space-x-2">
                <CheckCircle size={18} />
                <span>Konfirmasi Pesanan</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PemesananPelanggan;
