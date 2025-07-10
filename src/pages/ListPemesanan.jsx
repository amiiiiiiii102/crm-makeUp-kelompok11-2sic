import React, { useEffect, useState, useCallback } from "react";
import { Info } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { supabase } from "../supabase"; // Pastikan path ini benar
import { ShoppingBag, User, MapPin, Phone, CreditCard, Heart, Star, Sparkles, AlertTriangle, CheckCircle, XCircle, AlertCircle } from "lucide-react"; // Tambahkan AlertCircle

const ListPemesanan = () => {
    const location = useLocation();

    const [produk, setProduk] = useState(null);
    const [user, setUser] = useState(null);
    const [existingCustomer, setExistingCustomer] = useState(null);
    const [jumlah, setJumlah] = useState(1);
    const [formData, setFormData] = useState({
        nama: "",
        alamat: "",
        nohp: "",
        metodePembayaran: "",
    });
    const [loadingProduk, setLoadingProduk] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    const [error, setError] = useState(null);

    // State untuk modal konfirmasi kustom
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");

    // === State baru untuk Notifikasi Tengah Layar (menggantikan alert) ===
    const [notifMessage, setNotifMessage] = useState(null);
    const [notifType, setNotifType] = useState('info'); // 'success', 'error', 'info'
    const [showNotif, setShowNotif] = useState(false); // Mengelola visibilitas notifikasi
    // ===========================================

    // Fungsi untuk menampilkan notifikasi kustom
    const showNotification = useCallback((message, type) => {
        setNotifMessage(message);
        setNotifType(type);
        setShowNotif(true);
        // Notifikasi akan hilang otomatis setelah 3 detik
        setTimeout(() => {
            setNotifMessage(null);
            setShowNotif(false);
        }, 3000); // Durasi notifikasi: 3 detik
    }, []);


    useEffect(() => {
        fetchUser();

        const params = new URLSearchParams(location.search);
        const id_produk_from_url = params.get('id');

        console.log("DEBUG ListPemesanan (useEffect): location.search =", location.search);
        console.log("DEBUG ListPemesanan (useEffect): id_produk_from_url dari URL =", id_produk_from_url);

        if (id_produk_from_url) {
            fetchProduk(id_produk_from_url);
        } else {
            showNotification("ID Produk tidak ditemukan di URL. Tidak dapat memuat detail produk.", "error");
            setLoadingProduk(false);
            console.error("DEBUG ListPemesanan (useEffect): ID Produk UNDEFINED di URL. URL:", location.search);
        }
    }, [location.search, showNotification]);

    useEffect(() => {
        if (user && !formData.nama && !formData.nohp) {
            setFormData(prev => ({
                ...prev,
                nama: user.name || "",
                nohp: user.phone || "",
            }));
        }
        if (user && user.email) {
            fetchExistingCustomer(user.email);
        }
    }, [user]);

    const fetchUser = async () => {
        setLoadingUser(true);
        try {
            const {
                data: { session },
                error: sessionError
            } = await supabase.auth.getSession();

            if (sessionError) {
                showNotification("Gagal mendapatkan sesi pengguna.", "error");
                setLoadingUser(false);
                return;
            }

            if (session) {
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("email", session.user.email)
                    .single();

                if (userError) {
                    console.error("Error fetching user data:", userError);
                    showNotification("Gagal memuat data pengguna.", "error");
                } else {
                    setUser(userData);
                    console.log("DEBUG ListPemesanan: Data user berhasil diambil:", userData);
                }
            } else {
                console.warn("DEBUG ListPemesanan: Sesi pengguna tidak ditemukan.");
                showNotification("Anda harus login untuk melanjutkan.", "info");
            }
        } catch (err) {
            console.error("Unexpected error fetching user:", err);
            showNotification("Terjadi kesalahan tak terduga saat memuat pengguna.", "error");
        } finally {
            setLoadingUser(false);
        }
    };

    const fetchExistingCustomer = async (userEmail) => {
        try {
            const { data: customerData, error: customerError } = await supabase
                .from("pelanggan")
                .select("*")
                .eq("email", userEmail)
                .single();

            if (customerError && customerError.code !== 'PGRST116') {
                console.error("Error fetching existing customer data:", customerError);
            } else if (customerData) {
                setExistingCustomer(customerData);
                setFormData(prev => ({
                    ...prev,
                    nama: customerData.nama || prev.nama,
                    alamat: customerData.alamat || prev.alamat,
                    nohp: customerData.nohp || prev.nohp,
                }));
                console.log("DEBUG ListPemesanan: Data pelanggan yang sudah ada berhasil diambil:", customerData);
            } else {
                setExistingCustomer(null);
                console.log("DEBUG ListPemesanan: Pelanggan belum terdaftar.");
            }
        } catch (err) {
            console.error("Unexpected error fetching existing customer:", err);
        }
    };

    const fetchProduk = async (productId) => {
        setLoadingProduk(true);
        setError(null);
        try {
            if (!productId) {
                console.warn("DEBUG ListPemesanan: fetchProduk dipanggil tanpa productId.");
                showNotification("ID Produk tidak valid.", "error");
                setLoadingProduk(false);
                return;
            }

            const { data, error } = await supabase
                .from("produk")
                .select("*")
                .eq("id_produk", productId)
                .single();

            if (error) {
                console.error("DEBUG ListPemesanan: Error fetching product:", error);
                showNotification("Gagal memuat detail produk.", "error");
            } else if (data) {
                setProduk(data);
                console.log("DEBUG ListPemesanan: Detail produk berhasil diambil:", data);
            } else {
                showNotification("Produk tidak ditemukan.", "error");
            }
        } catch (err) {
            console.error("DEBUG ListPemesanan: Unexpected error fetching product:", err);
            showNotification("Terjadi kesalahan tak terduga saat memuat produk.", "error");
        } finally {
            setLoadingProduk(false);
        }
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const processSubmit = async () => {
        const { nama, alamat, nohp, metodePembayaran } = formData;
        const totalHargaPesanan = produk.price * jumlah;

        let customerUpdateSuccess = false;

        if (existingCustomer) {
            const newTotalPesanan = existingCustomer.totalpesanan + jumlah;
            const newTotalBelanja = existingCustomer.totalbelanja + totalHargaPesanan;

            const { error: updateError } = await supabase.from("pelanggan")
                .update({
                    nama,
                    alamat,
                    nohp,
                    totalpesanan: newTotalPesanan,
                    totalbelanja: newTotalBelanja,
                })
                .eq("email", user.email);

            if (!updateError) {
                showNotification("Data pelanggan berhasil diperbarui.", "success");
                customerUpdateSuccess = true;
                fetchExistingCustomer(user.email); // Refresh customer data
            } else {
                console.error("Update pelanggan error:", updateError);
                showNotification("Gagal memperbarui data pelanggan. Error: " + updateError.message, "error");
                return; // Stop here if customer update fails
            }

        } else {
            const { error: insertError } = await supabase.from("pelanggan").insert({
                pelanggan_id: crypto.randomUUID(), // Ini akan dibuatkan otomatis oleh Supabase jika `pelanggan_id` diset sebagai UUID default
                nama,
                alamat,
                nohp,
                email: user.email,
                kategori: "Bronze",
                totalpesanan: jumlah,
                totalbelanja: totalHargaPesanan,
                tanggalbergabung: new Date().toISOString(),
                fotoprofil: "", // Asumsi kosong, bisa diisi path default jika ada
            });

            if (!insertError) {
                showNotification("Pelanggan baru berhasil ditambahkan.", "success");
                customerUpdateSuccess = true;
                fetchExistingCustomer(user.email); // Refresh customer data
            } else {
                console.error("Insert pelanggan error:", insertError);
                showNotification("Gagal menambahkan pelanggan baru. Error: " + insertError.message, "error");
                return; // Stop here if new customer insertion fails
            }
        }

        // --- Tambahkan logika untuk menyimpan ke tabel 'pesanan' di sini ---
        if (customerUpdateSuccess) {
            try {
                const { data: pesananData, error: pesananError } = await supabase
                    .from("pesanan")
                    .insert({
                        // id_pesanan: Supabase akan membuat ini otomatis jika diset UUID default
                        id_user: user.id, // Ambil id_user dari objek user yang sudah didapatkan
                        id_belanja: produk.id_produk, // Mengacu pada id_produk yang dibeli
                        tanggal_pesanan: new Date().toISOString(),
                        total_harga: totalHargaPesanan,
                        metode_pembayaran: metodePembayaran,
                        alamat_pengiriman: alamat,
                        catatan: "", // Anda bisa menambahkan input untuk ini jika diperlukan
                        status: "Menunggu Konfirmasi", // Status awal pesanan
                        // created_at: Supabase akan membuat ini otomatis
                        Total_barang: jumlah,
                    })
                    .select(); // Mengembalikan data yang baru saja dimasukkan

                if (pesananError) {
                    console.error("Error inserting into pesanan:", pesananError);
                    showNotification("Gagal menyimpan detail pesanan. Error: " + pesananError.message, "error");
                } else {
                    console.log("Pesanan berhasil disimpan:", pesananData);
                    showNotification("Pesanan berhasil dikirim!", "success");
                    // Tambahkan navigasi atau reset form setelah sukses
                    setFormData({ // Reset form setelah sukses
                        nama: user.name || "", // Kembali ke nama user atau kosong
                        alamat: existingCustomer?.alamat || "", // Kembali ke alamat existing customer atau kosong
                        nohp: user.phone || "", // Kembali ke nohp user atau kosong
                        metodePembayaran: "",
                    });
                    setJumlah(1); // Reset jumlah
                }
            } catch (err) {
                console.error("Unexpected error saving order:", err);
                showNotification("Terjadi kesalahan tak terduga saat menyimpan pesanan.", "error");
            }
        }
        // -------------------------------------------------------------------
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const { nama, alamat, nohp, metodePembayaran } = formData;

        if (!nama || !alamat || !nohp || !metodePembayaran) {
            showNotification("Harap lengkapi semua data.", "error");
            return;
        }

        if (!produk || !user) {
            showNotification("Data produk atau pengguna belum dimuat sepenuhnya. Mohon tunggu.", "info");
            return;
        }

        let message = "";
        let shouldConfirm = false;

        if (existingCustomer) {
            const nameChanged = existingCustomer.nama !== nama;
            const phoneChanged = existingCustomer.nohp !== nohp;

            if (nameChanged && phoneChanged) {
                message = "Nama dan Nomor HP yang Anda masukkan berbeda dengan data sebelumnya. Lanjutkan?";
                shouldConfirm = true;
            } else if (nameChanged) {
                message = "Nama yang Anda masukkan berbeda dengan data sebelumnya. Lanjutkan?";
                shouldConfirm = true;
            } else if (phoneChanged) {
                message = "Nomor HP yang Anda masukkan berbeda dengan data sebelumnya. Lanjutkan?";
                shouldConfirm = true;
            }
        }

        if (shouldConfirm) {
            setConfirmationMessage(message);
            setShowConfirmationModal(true);
        } else {
            processSubmit();
        }
    };

    const handleCancelConfirmation = () => {
        setShowConfirmationModal(false);
        setConfirmationMessage("");
    };

    const handleConfirmAction = () => {
        setShowConfirmationModal(false);
        processSubmit();
    };

    // --- Komponen FloatingNotification disematkan langsung di sini ---
    const FloatingNotification = ({ message, type = 'success', isVisible, onClose }) => {
        const [isAnimating, setIsAnimating] = useState(false);
        const [shouldRender, setShouldRender] = useState(isVisible);

        // Variabel untuk menyimpan konfigurasi notifikasi
        let config = {};

        useEffect(() => {
            if (isVisible) {
                setShouldRender(true);
                setTimeout(() => setIsAnimating(true), 50);
            } else {
                setIsAnimating(false);
                // Waktu timeout ini harus lebih lama dari durasi transisi 'duration-600'
                // Misalnya, 600ms (durasi transisi) + buffer
                setTimeout(() => setShouldRender(false), 600);
            }
        }, [isVisible]);

        // Konfigurasi warna dan ikon dengan tema kosmetik orange
        switch (type) {
            case 'success':
                config = {
                    bgColor: 'bg-gradient-to-r from-orange-50 to-amber-50',
                    borderColor: 'border-orange-200',
                    textColor: 'text-orange-800',
                    iconColor: 'text-orange-500',
                    shadowColor: 'shadow-orange-200/50',
                    icon: <CheckCircle className="w-6 h-6" />,
                    accent: 'bg-orange-400'
                };
                break;
            case 'error':
                config = {
                    bgColor: 'bg-gradient-to-r from-red-50 to-orange-50',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-800',
                    iconColor: 'text-red-500',
                    shadowColor: 'shadow-red-200/50',
                    icon: <XCircle className="w-6 h-6" />,
                    accent: 'bg-red-400'
                };
                break;
            case 'warning':
                config = {
                    bgColor: 'bg-gradient-to-r from-amber-50 to-orange-50',
                    borderColor: 'border-amber-200',
                    textColor: 'text-amber-800',
                    iconColor: 'text-amber-500',
                    shadowColor: 'shadow-amber-200/50',
                    icon: <AlertCircle className="w-6 h-6" />,
                    accent: 'bg-amber-400'
                };
                break;
            default: // 'info' atau tipe lainnya
                config = {
                    bgColor: 'bg-gradient-to-r from-orange-50 to-pink-50',
                    borderColor: 'border-orange-200',
                    textColor: 'text-orange-800',
                    iconColor: 'text-orange-500',
                    shadowColor: 'shadow-orange-200/50',
                    icon: <Info className="w-6 h-6" />,
                    accent: 'bg-orange-400'
                };
                break;
        }

        // Hanya render jika shouldRender true dan ada message
        if (!shouldRender || !message) return null;

        return (
            <div
                className={`
                    fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none
                    transition-all duration-600 ease-out
                    ${isAnimating ? 'opacity-100 backdrop-blur-[2px]' : 'opacity-0'}
                `}
            >
                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className={`
                                absolute w-2 h-2 rounded-full bg-orange-300/30
                                animate-pulse
                                ${isAnimating ? 'animate-bounce' : ''}
                            `}
                            style={{
                                left: `${20 + i * 15}%`,
                                top: `${30 + (i % 3) * 20}%`,
                                animationDelay: `${i * 0.2}s`,
                                animationDuration: `${2 + i * 0.3}s`
                            }}
                        />
                    ))}
                </div>

                {/* Main notification container */}
                <div
                    className={`
                        relative max-w-md mx-4 p-6 rounded-2xl shadow-2xl border-2
                        backdrop-blur-md pointer-events-auto // Pointer-events-auto agar tombol close bisa diklik
                        ${config.bgColor} ${config.borderColor} ${config.shadowColor}
                        transition-all duration-600 ease-out transform
                        ${isAnimating
                            ? 'translate-y-0 scale-100 rotate-0'
                            : '-translate-y-20 scale-95 -rotate-1'
                        }
                        hover:scale-105 hover:shadow-3xl hover:-translate-y-1
                        before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r
                        before:from-orange-100/20 before:to-pink-100/20 before:opacity-0
                        before:transition-opacity before:duration-300 hover:before:opacity-100
                    `}
                    role="alert"
                    style={{
                        background: `linear-gradient(135deg, rgba(255, 237, 213, 0.95), rgba(254, 243, 199, 0.95))`,
                        boxShadow: `0 25px 50px -12px rgba(251, 146, 60, 0.25), 0 0 0 1px rgba(251, 146, 60, 0.1)`
                    }}
                >
                    {/* Accent bar */}
                    <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 ${config.accent} rounded-full`} />

                    {/* Sparkle decorations */}
                    <div className="absolute -top-2 -right-2">
                        <Sparkles className={`w-5 h-5 ${config.iconColor} animate-pulse`} />
                    </div>
                    <div className="absolute -bottom-1 -left-1">
                        <Heart className={`w-4 h-4 ${config.iconColor} animate-pulse`} style={{ animationDelay: '0.5s' }} />
                    </div>

                    {/* Content */}
                    <div className="flex items-center space-x-4">
                        {/* Icon container with animation */}
                        <div className={`
                            flex-shrink-0 p-2 rounded-full bg-white/50 backdrop-blur-sm
                            ${isAnimating ? 'animate-bounce' : ''}
                            transition-all duration-300 hover:bg-white/80
                        `}>
                            <div className={`${config.iconColor} transition-transform duration-300 hover:scale-110`}>
                                {config.icon}
                            </div>
                        </div>

                        {/* Message */}
                        <div className="flex-1 min-w-0">
                            <p className={`
                                font-semibold text-lg ${config.textColor}
                                transition-all duration-300
                                ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}
                            `}>
                                {message}
                            </p>
                        </div>

                        {/* Close button */}
                        {onClose && (
                            <button
                                onClick={onClose}
                                className={`
                                    flex-shrink-0 p-1 rounded-full hover:bg-white/50
                                    transition-all duration-200 hover:scale-110
                                    ${config.textColor} opacity-60 hover:opacity-100
                                `}
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Shimmer effect */}
                    <div className={`
                        absolute inset-0 rounded-2xl opacity-0 hover:opacity-100
                        bg-gradient-to-r from-transparent via-white/20 to-transparent
                        transform -skew-x-12 -translate-x-full
                        transition-all duration-1000 hover:translate-x-full
                    `} />
                </div>
            </div>
        );
    };
    // -----------------------------------------------------------------


    // Loading state
    if (loadingProduk || loadingUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4 relative">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Memuat data produk dan pengguna...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    if (!produk || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-4">
                    <p className="text-gray-600 font-medium">Tidak dapat memuat detail pembelian. Coba kembali.</p>
                </div>
            </div>
        );
    }

    const totalHarga = produk.price * jumlah;

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 text-orange-500 mr-2" />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            Form Pembelian Produk
                        </h1>
                        <Sparkles className="w-8 h-8 text-orange-500 mr-2" />
                    </div>
                    <p className="text-gray-600">Complete your beauty journey with our premium products</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Product Card */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="relative">
                            <img
                                src={produk.image || "https://images.unsplash.com/photo-1556228578-dd6a7b9b0e58?w=400&h=300&fit=crop"}
                                alt={produk.name}
                                className="w-full h-64 object-cover"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                                <Heart className="w-5 h-5 text-orange-500" />
                            </div>
                            <div className="absolute bottom-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                                Premium Quality
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                                <span className="text-sm text-gray-500 ml-2">(4.9/5)</span>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-800 mb-3">{produk.name}</h3>
                            <p className="text-gray-600 mb-4 leading-relaxed">{produk.description}</p>

                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Harga Satuan</p>
                                    <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                        Rp{Number(produk.price).toLocaleString("id-ID")}
                                    </p>
                                </div>

                                <div className="flex items-center bg-gray-50 rounded-xl p-2">
                                    <button
                                        onClick={() => setJumlah(Math.max(1, jumlah - 1))}
                                        className="cursor-pointer w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={jumlah}
                                        onChange={(e) => setJumlah(Number(e.target.value))}
                                        className="cursor-pointer w-16 text-center bg-transparent font-medium text-gray-800"
                                    />
                                    <button
                                        onClick={() => setJumlah(jumlah + 1)}
                                        className="cursor-pointer w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 text-white">
                                <p className="text-sm opacity-90">Total Harga</p>
                                <p className="text-3xl font-bold">
                                    Rp{Number(totalHarga).toLocaleString("id-ID")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Form */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <div className="flex items-center mb-6">
                            <ShoppingBag className="w-6 h-6 text-orange-500 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-800">Complete Your Order</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <User className="w-4 h-4 mr-2" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <User className="w-4 h-4 mr-2" />
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    name="nama"
                                    value={formData.nama}
                                    onChange={handleChange}
                                    required
                                    placeholder="Masukkan nama lengkap Anda"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Alamat Lengkap
                                </label>
                                <textarea
                                    name="alamat"
                                    value={formData.alamat}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    placeholder="Masukkan alamat lengkap untuk pengiriman"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <Phone className="w-4 h-4 mr-2" />
                                    No HP
                                </label>
                                <input
                                    type="text"
                                    name="nohp"
                                    value={formData.nohp}
                                    onChange={handleChange}
                                    required
                                    placeholder="08xxxxxxxxxx"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Metode Pembayaran
                                </label>
                                <select
                                    name="metodePembayaran"
                                    value={formData.metodePembayaran}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                >
                                    <option value="">-- Pilih Metode Pembayaran --</option>
                                    <option value="Transfer Bank">💳 Transfer Bank</option>
                                    <option value="COD">🚚 Bayar di Tempat (COD)</option>
                                    <option value="E-Wallet">📱 E-Wallet (OVO, GoPay, dll)</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 px-6 rounded-xl hover:from-orange-600 hover:to-red-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <div className="cursor-pointer flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 mr-2" />
                                    Kirim Pesanan
                                </div>
                            </button>
                        </form>

                        <div className="mt-6 p-4 bg-orange-50 rounded-xl">
                            <p className="text-sm text-gray-700 font-medium">Informasi Penting:</p>
                            <ul className="list-disc list-inside text-gray-600 text-sm mt-2 space-y-1">
                                <li>Pastikan data yang Anda masukkan benar untuk kelancaran pengiriman.</li>
                                <li>Setelah pesanan dikirim, status akan "Menunggu Konfirmasi".</li>
                                <li>Kami akan segera menghubungi Anda untuk konfirmasi pesanan dan detail pembayaran.</li>
                                {existingCustomer && (
                                    <li>Selamat datang kembali! Anda adalah pelanggan setia kami.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmationModal && (
    <div
        style={{
            backgroundColor: 'rgba(100, 100, 100, 0.5)', /* Latar belakang abu-abu semi-transparan */
            backdropFilter: 'blur(5px)', /* Efek blur */
            WebkitBackdropFilter: 'blur(5px)' /* Untuk kompatibilitas browser lama seperti Safari */
        }}
        className="fixed inset-0 flex items-center justify-center z-50"
    >
        <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm text-center">
            {/* Tambahkan kelas animasi di sini */}
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-scale-in" /> 
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Konfirmasi Perubahan Data</h3>
            <p className="text-gray-600 mb-6">{confirmationMessage}</p>
            <div className="flex justify-center space-x-4">
                <button
                    onClick={handleCancelConfirmation}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    Batal
                </button>
                <button
                    onClick={handleConfirmAction}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Lanjutkan
                </button>
            </div>
        </div>
    </div>
)}

            {/* Floating Notification */}
            <FloatingNotification
                message={notifMessage}
                type={notifType}
                isVisible={showNotif}
                onClose={() => setShowNotif(false)}
            />
        </div>
    );
};

export default ListPemesanan;