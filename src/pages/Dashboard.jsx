import React, { useState, useEffect } from 'react';
import {
  Chart,
  LineController,
  Filler
} from 'chart.js';

// Pastikan untuk mengimpor instance supabase Anda
import { supabase } from '../supabase'; 

Chart.register(LineController, Filler);

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { TrendingUp, Users, UserPlus, ShoppingBag, Sparkles } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Helper function to format currency
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'Rp0';
  return `Rp${amount.toLocaleString('id-ID')}`;
};

// Helper function to get current year's months
const getMonths = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return months;
};

const Dashboard = () => {
  const [stats, setStats] = useState([
    { label: "Pendapatan Hari Ini", value: "Loading...", percent: "", color: "green", icon: TrendingUp },
    { label: "Pengguna Hari Ini", value: "Loading...", percent: "", color: "blue", icon: Users },
    { label: "Klien Baru", value: "Loading...", percent: "", color: "red", icon: UserPlus },
    { label: "Penjualan", value: "Loading...", percent: "", color: "purple", icon: ShoppingBag },
  ]);
  const [barData, setBarData] = useState({
    labels: getMonths(),
    datasets: [{
      label: "Penjualan (IDR)",
      data: [],
      backgroundColor: "rgba(251, 146, 60, 0.8)",
      borderColor: "rgba(251, 146, 60, 1)",
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }],
  });
  const [lineData, setLineData] = useState({
    labels: getMonths(),
    datasets: [{
      label: "Jumlah Pelanggan",
      data: [],
      borderColor: "rgba(194, 65, 12, 1)",
      backgroundColor: "rgba(251, 146, 60, 0.1)",
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: "rgba(194, 65, 12, 1)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(194, 65, 12, 1)",
    }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of today
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Set to start of tomorrow

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);

        // --- Fetch Summary Stats ---
        // Pendapatan Hari Ini
        const { data: todayRevenueData, error: todayRevenueError } = await supabase
          .from('pesanan')
          .select('total_harga')
          .gte('tanggal_pesanan', today.toISOString())
          .lt('tanggal_pesanan', tomorrow.toISOString());

        const todayRevenue = todayRevenueData ? todayRevenueData.reduce((sum, item) => sum + item.total_harga, 0) : 0;

        // Pengguna Hari Ini
        const { data: todayUsersData, error: todayUsersError } = await supabase
          .from('pelanggan')
          .select('pelanggan_id')
          .gte('tanggalbergabung', today.toISOString())
          .lt('tanggalbergabung', tomorrow.toISOString());

        const todayUsers = todayUsersData ? todayUsersData.length : 0;

        // Klien Baru (contoh: dalam 7 hari terakhir)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        const { data: newClientsData, error: newClientsError } = await supabase
          .from('pelanggan')
          .select('pelanggan_id')
          .gte('tanggalbergabung', sevenDaysAgo.toISOString());
        const newClients = newClientsData ? newClientsData.length : 0;

        // Penjualan Total (keseluruhan)
        const { data: totalSalesData, error: totalSalesError } = await supabase
          .from('pesanan')
          .select('total_harga');
        const totalSales = totalSalesData ? totalSalesData.reduce((sum, id_pesanan) => sum + id_pesanan.total_harga, 0) : 0;

        // Anda perlu menambahkan logika untuk menghitung persentase perubahan di sini.
        // Ini akan melibatkan pengambilan data dari periode sebelumnya (kemarin, bulan lalu, dll.)
        // Untuk contoh ini, saya akan menggunakan nilai statis untuk persentase.
        setStats([
          { label: "Pendapatan Hari Ini", value: formatCurrency(todayRevenue), percent: "+15%", color: "green", icon: TrendingUp },
          { label: "Pengguna Hari Ini", value: todayUsers.toLocaleString('id-ID'), percent: "+3%", color: "blue", icon: Users },
          { label: "Klien Baru", value: `+${newClients.toLocaleString('id-ID')}`, percent: "+10%", color: "green", icon: UserPlus },
          { label: "Penjualan", value: formatCurrency(totalSales), percent: "+8%", color: "purple", icon: ShoppingBag },
        ]);

        // --- Fetch Monthly Sales Data (Bar Chart) ---
        // Supabase PostgREST bisa melakukan agregasi, tapi kita harus memformatnya
        // atau menggunakan fungsi database. Untuk contoh ini, kita ambil semua data
        // dan agregasi di client-side. Untuk performa yang lebih baik pada data besar,
        // pertimbangkan fungsi SQL kustom di Supabase.

        // Example: Get sales for current year
        const { data: annualSalesData, error: annualSalesError } = await supabase
          .from('pesanan')
          .select('tanggal_pesanan, total_harga')
          .gte('tanggal_pesanan', startOfYear.toISOString())
          .lt('tanggal_pesanan', endOfYear.toISOString());

        if (annualSalesError) throw annualSalesError;

        const monthlySalesMap = new Array(12).fill(0); // Inisialisasi dengan 0 untuk 12 bulan
        annualSalesData.forEach(item => {
          const date = new Date(item.tanggal_pesanan);
          const monthIndex = date.getMonth(); // 0 for Jan, 11 for Dec
          monthlySalesMap[monthIndex] += item.total_harga;
        });

        setBarData(prevData => ({
          ...prevData,
          datasets: [{ ...prevData.datasets[0], data: monthlySalesMap }],
        }));

        // --- Fetch Customer Growth Data (Line Chart) ---
        // Example: Get new customers for current year
        const { data: annualCustomersData, error: annualCustomersError } = await supabase
          .from('pelanggan')
          .select('tanggalbergabung')
          .gte('tanggalbergabung', startOfYear.toISOString())
          .lt('tanggalbergabung', endOfYear.toISOString());

        if (annualCustomersError) throw annualCustomersError;

        const monthlyCustomersMap = new Array(12).fill(0);
        annualCustomersData.forEach(item => {
          const date = new Date(item.tanggalbergabung);
          const monthIndex = date.getMonth();
          monthlyCustomersMap[monthIndex] += 1; // Count new customer for that month
        });

        // Jika Anda ingin pertumbuhan kumulatif:
        // const cumulativeCustomers = monthlyCustomersMap.reduce((acc, count, index) => {
        //   const prevCumulative = index > 0 ? acc[index - 1] : 0;
        //   acc.push(prevCumulative + count);
        //   return acc;
        // }, []);

        setLineData(prevData => ({
          ...prevData,
          datasets: [{ ...prevData.datasets[0], data: monthlyCustomersMap }], // Ganti ke cumulativeCustomers jika menggunakan kumulatif
        }));


      } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
        // Tangani error dengan lebih baik, mungkin tampilkan pesan di UI
        setStats(prevStats => prevStats.map(stat => ({ ...stat, value: "Error!", percent: "", color: "red", icon: stat.icon })));
        setBarData(prevData => ({ ...prevData, datasets: [{ ...prevData.datasets[0], data: [] }] }));
        setLineData(prevData => ({ ...prevData, datasets: [{ ...prevData.datasets[0], data: [] }] }));
      }
    };

    fetchData();
  }, []); // Dependensi kosong agar hanya berjalan sekali saat mount

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            weight: '500'
          },
          color: '#78716c'
        }
      },
      title: { 
        display: true, 
        text: 'Penjualan Bulanan Tahun Ini',
        font: {
          size: 16,
          weight: '600'
        },
        color: '#78716c',
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            if (value >= 1000000) return 'Rp' + (value / 1000000).toFixed(1) + ' Juta';
            if (value >= 1000) return 'Rp' + (value / 1000).toFixed(0) + ' Ribu';
            return 'Rp' + value.toLocaleString('id-ID');
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#78716c',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Penjualan (Rupiah)',
          color: '#78716c',
          font: {
            size: 12,
            weight: '500'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#78716c',
          font: {
            size: 11
          },
          callback: function(value) {
            if (value >= 1000000) return 'Rp' + (value / 1000000).toLocaleString('id-ID') + ' Jt';
            if (value >= 1000) return 'Rp' + (value / 1000).toLocaleString('id-ID') + ' Rb';
            return 'Rp' + value.toLocaleString('id-ID');
          }
        }
      }
    }
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            weight: '500'
          },
          color: '#78716c'
        }
      },
      title: { 
        display: true, 
        text: 'Pertumbuhan Pelanggan Tahun Ini',
        font: {
          size: 16,
          weight: '600'
        },
        color: '#78716c',
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#78716c',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Jumlah Pelanggan',
          color: '#78716c',
          font: {
            size: 12,
            weight: '500'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#78716c',
          font: {
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 p-4 md:p-6">
     

      {/* Statistik utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map(({ label, value, percent, color, icon: Icon }) => (
          <div key={label} className="group">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-orange-100/50 hover:border-orange-200 transform hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${
                  color === 'green' ? 'from-emerald-500 to-green-500' :
                  color === 'blue' ? 'from-blue-500 to-cyan-500' :
                  color === 'red' ? 'from-rose-500 to-pink-500' :
                  'from-purple-500 to-indigo-500'
                }`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  color === 'green' ? 'text-emerald-500 bg-emerald-50' :
                  color === 'blue' ? 'text-blue-500 bg-blue-50' :
                  color === 'red' ? 'text-rose-500 bg-rose-50' :
                  'text-purple-500 bg-purple-50'
                }`}>
                  {percent}
                </div>
              </div>
              <p className="text-sm text-stone-600 mb-2 font-medium">{label}</p>
              <h2 className="text-2xl font-bold text-stone-800 group-hover:text-orange-600 transition-colors">
                {value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        {/* Grafik Penjualan Bulanan */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-orange-100/50">
          <div className="h-80">
            <Bar options={barOptions} data={barData} />
          </div>
        </div>

        {/* Grafik Pertumbuhan Pelanggan */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-orange-100/50">
          <div className="h-80">
            <Line options={lineOptions} data={lineData} />
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-20 right-10 w-32 h-32 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="fixed bottom-20 left-10 w-40 h-40 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full opacity-20 blur-3xl -z-10"></div>
    </div>
  );
};

export default Dashboard;