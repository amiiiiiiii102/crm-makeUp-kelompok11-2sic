// src/components/InfoPemesananPelanggan.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabase';
import {
  Package, ShoppingBag, RefreshCcw, Search, Filter, CheckCircle,
  XCircle, AlertCircle, Info, Sparkles
} from 'lucide-react';

const InfoPemesananPelanggan = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [notifMessage, setNotifMessage] = useState(null);
  const [notifType, setNotifType] = useState('info');
  const [showNotif, setShowNotif] = useState(false);

  const showNotification = useCallback((message, type) => {
    setNotifMessage(message);
    setNotifType(type);
    setShowNotif(true);
    setTimeout(() => {
      setNotifMessage(null);
      setShowNotif(false);
    }, 3000);
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        const msg = sessionError ? sessionError.message : 'Anda harus login untuk melihat pesanan Anda.';
        setError(msg);
        showNotification(msg, sessionError ? 'error' : 'warning');
        setLoading(false);
        return;
      }

      const userId = session.user.id;
      const { data, error } = await supabase
        .from('pesanan')
        .select(`*, users (email, role), produk (name, image, price), pelanggan (nama, nohp, email, alamat)`) 
        .eq('id_user', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processed = data.map(order => ({
        ...order,
        customer_name: order.pelanggan?.nama || 'N/A',
        customer_email: order.pelanggan?.email || order.users?.email || 'N/A',
        customer_nohp: order.pelanggan?.nohp || 'N/A',
        final_alamat_pengiriman: order.alamat_pengiriman || order.pelanggan?.alamat || 'Tidak tersedia',
        product_name: order.produk?.name || 'Produk Tidak Ditemukan',
        product_image: order.produk?.image || 'https://via.placeholder.com/60?text=No+Image',
        product_price_per_item: order.produk?.price || 0
      }));

      setOrders(processed);
    } catch (err) {
      setError('Terjadi kesalahan tak terduga saat memuat pesanan.');
      showNotification('Terjadi kesalahan tak terduga.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const FloatingNotification = ({ message, type = 'success', isVisible, onClose }) => {
    if (!isVisible || !message) return null;
    const colors = {
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      info: 'bg-blue-100 text-blue-800'
    };
    const icons = {
      success: <CheckCircle className="w-5 h-5" />,
      error: <XCircle className="w-5 h-5" />,
      warning: <AlertCircle className="w-5 h-5" />,
      info: <Info className="w-5 h-5" />
    };
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className={`rounded-lg p-4 shadow-md border ${colors[type]} flex items-center space-x-3`}>
          {icons[type]}
          <p className="text-sm font-medium">{message}</p>
          {onClose && <button onClick={onClose}><XCircle className="w-4 h-4 text-gray-500" /></button>}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* HERO */}
      <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 pb-20 pt-16 text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-12 h-12 text-orange-100 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Riwayat Pesanan Anda</h1>
          <p className="text-orange-100">Lihat dan kelola pesanan yang telah Anda lakukan 🛍️</p>
        </div>
      </div>

      {/* FILTER */}
      <div className="max-w-6xl mx-auto px-6 mt-10">
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari produk atau status..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-400 bg-orange-50 text-gray-700 placeholder:text-orange-400"
            />
          </div>
          <div className="relative w-full sm:w-56">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-400 bg-orange-50 text-gray-700"
            >
              <option value="All">Semua Status</option>
              <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
              <option value="Dikonfirmasi">Dikonfirmasi</option>
              <option value="Diproses">Diproses</option>
              <option value="Dikirim">Dikirim</option>
              <option value="Selesai">Selesai</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* DATA */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <p className="text-center text-orange-600">Memuat pesanan...</p>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center text-orange-600">
            <Package className="w-12 h-12 mx-auto mb-2" />
            <p className="font-semibold">Tidak ada pesanan ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow border border-orange-100 bg-white">
            <table className="min-w-full divide-y divide-orange-100">
              <thead className="bg-orange-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-orange-800">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-orange-800">Produk</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-orange-800">Jumlah</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-orange-800">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-orange-800">Pembayaran</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-orange-800">Alamat</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-orange-800">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-orange-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id_pesanan} className="hover:bg-orange-50 transition">
                    <td className="px-6 py-4 text-sm">
                      {new Date(order.tanggal_pesanan).toLocaleDateString('id-ID')}<br />
                      <span className="text-xs text-gray-500">
                        {new Date(order.tanggal_pesanan).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-3">
                        <img src={order.product_image} alt={order.product_name} className="w-10 h-10 object-cover rounded-md" />
                        <div>
                          <div className="font-semibold">{order.product_name}</div>
                          <div className="text-xs text-gray-500">Rp{Number(order.product_price_per_item).toLocaleString('id-ID')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{order.Total_barang}</td>
                    <td className="px-6 py-4 text-sm font-semibold">Rp{Number(order.total_harga).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-sm">{order.metode_pembayaran}</td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate" title={order.final_alamat_pengiriman}>{order.final_alamat_pengiriman}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                        order.status === 'Dikirim' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Diproses' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Dikonfirmasi' ? 'bg-indigo-100 text-indigo-800' :
                        order.status === 'Menunggu Konfirmasi' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FloatingNotification
        message={notifMessage}
        type={notifType}
        isVisible={showNotif}
        onClose={() => setShowNotif(false)}
      />
    </div>
  );
};

export default InfoPemesananPelanggan;
