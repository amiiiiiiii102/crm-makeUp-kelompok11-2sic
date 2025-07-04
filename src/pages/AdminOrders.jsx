// src/components/AdminOrder.jsx - Part 1
import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabase'; // Pastikan path ini benar
import {
    Package, Users, ShoppingBag, DollarSign, MapPin, Phone, MessageSquare, CheckCircle,
    XCircle, AlertCircle, RefreshCcw, Loader2, Search, Filter, Settings,
    Edit3, Save, Printer, User, Mail, CreditCard, Box, Tag, Image, Clock, Info, Heart, Sparkles
} from 'lucide-react';

const AdminOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [editingStatus, setEditingStatus] = useState('');

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
            const { data, error } = await supabase
                .from('pesanan')
                .select(`
                    *,
                    users (
                        email,
                        role
                    ),
                    produk (
                        name,
                        image,
                        price
                    ),
                    pelanggan (
                        nama,
                        nohp,
                        email,
                        alamat
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching orders:", error);
                setError("Gagal memuat data pesanan: " + error.message);
                showNotification("Gagal memuat data pesanan.", "error");
            } else {
                const processedOrders = data.map(order => {
                    const customerData = order.pelanggan;
                    const userData = order.users;

                    // Prioritaskan data pelanggan dari tabel 'pelanggan', fallback ke 'users' atau 'N/A'
                    const finalCustomerName = customerData?.nama || 'N/A';
                    const finalCustomerEmail = customerData?.email || userData?.email || 'N/A';
                    const finalCustomerNohp = customerData?.nohp || 'N/A';
                    const finalAlamatPengiriman = order.alamat_pengiriman || customerData?.alamat || 'Tidak tersedia';

                    return {
                        ...order,
                        customer_name: finalCustomerName,
                        customer_email: finalCustomerEmail,
                        customer_nohp: finalCustomerNohp,
                        product_name: order.produk?.name || 'Produk Tidak Ditemukan',
                        product_image: order.produk?.image || 'https://via.placeholder.com/60?text=No+Image',
                        product_price_per_item: order.produk?.price || 0,
                        final_alamat_pengiriman: finalAlamatPengiriman
                    };
                });
                setOrders(processedOrders);
                console.log("Fetched Orders:", processedOrders);
            }
        } catch (err) {
            console.error("Unexpected error fetching orders:", err);
            setError("Terjadi kesalahan tak terduga saat memuat pesanan.");
            showNotification("Terjadi kesalahan tak terduga.", "error");
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleEditStatus = (orderId, currentStatus) => {
        setEditingOrderId(orderId);
        setEditingStatus(currentStatus);
    };

    const handleSaveStatus = async (orderId) => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('pesanan')
                .update({ status: editingStatus })
                .eq('id_pesanan', orderId);

            if (error) {
                console.error("Error updating status:", error);
                showNotification("Gagal memperbarui status: " + error.message, "error");
            } else {
                showNotification("Status berhasil diperbarui!", "success");
                await fetchOrders(); // Refresh data setelah berhasil update
            }
        } catch (err) {
            console.error("Unexpected error updating status:", err);
            showNotification("Terjadi kesalahan tak terduga saat memperbarui status.", "error");
        } finally {
            setEditingOrderId(null);
            setEditingStatus('');
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingOrderId(null);
        setEditingStatus('');
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = searchTerm === '' ||
            order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.status.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'All' || order.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const FloatingNotification = ({ message, type = 'success', isVisible, onClose }) => {
        const [isAnimating, setIsAnimating] = useState(false);
        const [shouldRender, setShouldRender] = useState(isVisible);

        let config = {};

        useEffect(() => {
            if (isVisible) {
                setShouldRender(true);
                setTimeout(() => setIsAnimating(true), 50);
            } else {
                setIsAnimating(false);
                setTimeout(() => setShouldRender(false), 300);
            }
        }, [isVisible]);

        switch (type) {
            case 'success':
                config = {
                    bgColor: 'bg-white',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-800',
                    iconColor: 'text-green-600',
                    icon: <CheckCircle className="w-5 h-5" />,
                    accent: 'bg-green-500'
                };
                break;
            case 'error':
                config = {
                    bgColor: 'bg-white',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-800',
                    iconColor: 'text-red-600',
                    icon: <XCircle className="w-5 h-5" />,
                    accent: 'bg-red-500'
                };
                break;
            case 'warning':
                config = {
                    bgColor: 'bg-white',
                    borderColor: 'border-yellow-200',
                    textColor: 'text-yellow-800',
                    iconColor: 'text-yellow-600',
                    icon: <AlertCircle className="w-5 h-5" />,
                    accent: 'bg-yellow-500'
                };
                break;
            default:
                config = {
                    bgColor: 'bg-white',
                    borderColor: 'border-blue-200',
                    textColor: 'text-blue-800',
                    iconColor: 'text-blue-600',
                    icon: <Info className="w-5 h-5" />,
                    accent: 'bg-blue-500'
                };
                break;
        }

        if (!shouldRender || !message) return null;

        return (
            <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                <div className={`${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg p-4 max-w-sm`}>
                    <div className="flex items-center space-x-3">
                        <div className={`${config.iconColor} flex-shrink-0`}>
                            {config.icon}
                        </div>
                        <div className="flex-1">
                            <p className={`${config.textColor} font-medium text-sm`}>{message}</p>
                        </div>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };
    // src/components/AdminOrder.jsx - Part 2 (Lanjutan)

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Memuat data pesanan...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md mx-4">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-medium mb-4">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" /> Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center mb-4 sm:mb-0">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
                                <Settings className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Manajemen Pesanan</h1>
                                <p className="text-sm text-gray-500">Kelola dan pantau status pesanan</p>
                            </div>
                        </div>
                        <button
                            onClick={fetchOrders}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                            <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Cari berdasarkan email, produk, atau status..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                        <div className="sm:w-48">
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    value={filterStatus}
                                    onChange={handleFilterChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
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
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Produk
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pembayaran
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Alamat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                                            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                            <p className="text-lg font-medium">Tidak ada pesanan ditemukan</p>
                                            <p className="text-sm">Coba ubah filter pencarian Anda</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id_pesanan} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {new Date(order.tanggal_pesanan).toLocaleDateString('id-ID', {
                                                            day: '2-digit', month: 'short', year: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(order.tanggal_pesanan).toLocaleTimeString('id-ID', {
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {order.customer_email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="flex items-center">
                                                    <img
                                                        src={order.product_image}
                                                        alt={order.product_name}
                                                        className="w-10 h-10 rounded-lg object-cover mr-3"
                                                    />
                                                    <div>
                                                        <div className="font-medium">{order.product_name}</div>
                                                        <div className="text-xs text-gray-500">
                                                            Rp{Number(order.product_price_per_item).toLocaleString('id-ID')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {order.Total_barang}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                Rp{Number(order.total_harga).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {order.metode_pembayaran}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                                <div className="truncate" title={order.final_alamat_pengiriman}>
                                                    {order.final_alamat_pengiriman}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {editingOrderId === order.id_pesanan ? (
                                                    <select
                                                        value={editingStatus}
                                                        onChange={(e) => setEditingStatus(e.target.value)}
                                                        className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                                                        <option value="Dikonfirmasi">Dikonfirmasi</option>
                                                        <option value="Diproses">Diproses</option>
                                                        <option value="Dikirim">Dikirim</option>
                                                        <option value="Selesai">Selesai</option>
                                                        <option value="Dibatalkan">Dibatalkan</option>
                                                    </select>
                                                ) : (
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        order.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'Dikirim' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'Diproses' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'Dikonfirmasi' ? 'bg-indigo-100 text-indigo-800' :
                                                        order.status === 'Menunggu Konfirmasi' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {editingOrderId === order.id_pesanan ? (
                                                    <div className="flex space-x-1">
                                                        <button
                                                            onClick={() => handleSaveStatus(order.id_pesanan)}
                                                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                                                            title="Simpan"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                                                            title="Batal"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEditStatus(order.id_pesanan, order.status)}
                                                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                                        title="Edit Status"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
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

export default AdminOrder;