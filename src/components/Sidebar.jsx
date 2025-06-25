import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Box,
  BarChart2,
  Settings,
  User,
  HelpCircle,
  ClipboardList,
  LogIn,
  UserPlus,
  User2Icon,
  MessageCircle,
  Newspaper,
} from 'lucide-react';

import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../pages/auth/AuthContext'; // pastikan path ini sesuai

// Semua menu dengan role-nya
const allMenuItems = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard', roles: ['admin'] },
  { name: 'Produk', icon: <Box size={20} />, path: '/listproduk', roles: ['admin', 'pelanggan'] },
  { name: 'Pelanggan', icon: <User2Icon size={20} />, path: '/pelanggan', roles: ['admin'] },
  { name: 'Laporan', icon: <BarChart2 size={20} />, path: '/laporan', roles: ['admin'] },
  { name: 'Pemesanan', icon: <ShoppingCart size={20} />, path: '/pemesanan', roles: ['admin', 'pelanggan'] },
  { name: 'FAQ', icon: <HelpCircle size={20} />, path: '/FAQ', roles: ['admin', 'pelanggan'] },
  { name: 'Form Produk', icon: <ClipboardList size={20} />, path: '/ProductForm', roles: ['admin'] },
  { name: 'Chat Pelanggan', icon: <MessageCircle size={20} />, path: '/ChatPelanggan', roles: ['admin'] },
  { name: 'Artikel', icon: <Newspaper size={20} />, path: '/listartikel', roles: ['admin','pelanggan'] },

];

// Menu akun
const accountItems = [
  { name: 'Sign In', icon: <LogIn size={20} />, path: '/login' },
  // Tambahkan Sign Up atau Setting akun jika dibutuhkan
];

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);

  // Tentukan role
  const role = currentUser?.role || 'guest';

  // Filter menu berdasarkan role
  const menuItems = allMenuItems.filter((item) => item.roles.includes(role));

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-xl px-6 py-4 hidden md:flex flex-col z-30">
      
      {/* Logo */}
      <Link to="/" className="flex flex-col items-center mb-4 cursor-pointer">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="w-16 h-16 object-contain mb-2"
        />
        <h1 className="text-xl font-extrabold text-[#c1440e] tracking-wide text-center leading-tight">
          ISTANA COSMETIC
        </h1>
      </Link>

      {/* Navigasi */}
      <div className="flex-1 overflow-y-auto mt-2 flex flex-col justify-between">
        <nav className="space-y-1 mb-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-2 rounded-lg transition-all duration-200 group
                ${isActive(item.path)
                  ? 'bg-[#fff3ec] text-[#c1440e] font-semibold'
                  : 'text-gray-700 hover:bg-[#fff3ec] hover:text-[#c1440e]'}
              `}
            >
              <span className={`group-hover:scale-110 transition-transform ${isActive(item.path) ? 'text-[#c1440e]' : 'text-[#c1440e]'}`}>
                {item.icon}
              </span>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Akun */}
        <div className="mb-2">
          <div className="text-xs font-semibold text-gray-500 mb-2">AKUN</div>
          <nav className="space-y-1">
            {accountItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-2 rounded-lg transition-all duration-200 group
                  ${isActive(item.path)
                    ? 'bg-[#fff3ec] text-[#c1440e] font-semibold'
                    : 'text-gray-700 hover:bg-[#fff3ec] hover:text-[#c1440e]'}
                `}
              >
                <span className={`group-hover:scale-110 transition-transform ${isActive(item.path) ? 'text-[#c1440e]' : 'text-[#c1440e]'}`}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
