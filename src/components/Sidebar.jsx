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
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
  { name: 'Produk', icon: <Box size={20} />, path: '/produk' },
  { name: 'Pelanggan', icon: <User2Icon size={20} />, path: '/pelanggan' },
  { name: 'Laporan', icon: <BarChart2 size={20} />, path: '/laporan' },
  { name: 'Pemesanan', icon: <ShoppingCart size={20} />, path: '/pemesanan' },
  { name: 'FAQ', icon: <HelpCircle size={20} />, path: '/FAQ' },
  { name: 'Form Produk', icon: <ClipboardList size={20} />, path: '/ProductForm' },
  { name: 'Chat Pelanggan', icon: <MessageCircle size={20} />, path: '/ChatPelanggan' },
  { name: 'Artikel', icon: <Newspaper size={20} />, path: '/artikel' },
]

const accountItems = [
  { name: 'Pengaturan Akun', icon: <Settings size={20} />, path: '/akun' },
  { name: 'Sign In', icon: <LogIn size={20} />, path: '/login' },
  { name: 'Sign Up', icon: <UserPlus size={20} />, path: '/register' },
]

const Sidebar = () => {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-xl px-6 py-4 hidden md:flex flex-col z-30">
      
      {/* Logo dan Judul */}
      <Link to="/" className="flex flex-col items-center mb-4 cursor-pointer">
        <img
          src="/image/logo.png"
          alt="Logo"
          className="w-16 h-16 object-contain mb-2"
        />
        <h1 className="text-xl font-extrabold text-[#c1440e] tracking-wide text-center leading-tight">
          ISTANA COSMETIC
        </h1>
      </Link>

      {/* Navigasi Utama dan Akun */}
      <div className="flex-1 overflow-y-auto mt-2 flex flex-col justify-between">
        
        {/* Menu Navigasi */}
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
  )
}

export default Sidebar
