import { Search, User, ChevronDown, Settings, LogOut } from 'lucide-react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useContext, useState, useRef, useEffect } from 'react'
import { AuthContext } from '../pages/auth/AuthContext'

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isAuthenticated } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

 const getBreadcrumb = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);

  const pageMap = {
    dashboard: 'Dashboard',
    pelanggan: 'Pelanggan',
    produk: 'Produk',
    penjualan: 'Penjualan',
    productform: 'Form Produk',
    chatpelanggan: 'Chat Pelanggan',
    faq: 'FAQ',
    artikel: 'Artikel',
    pemesanan: 'Pemesanan',
    uploaddata: 'Upload Data Pelanggan',
    tambahpelanggan: 'Tambah Pelanggan',
    editpelanggan: 'Edit Pelanggan',
  };

  const firstSegment = segments[0]?.toLowerCase();

  // Halaman utama /dashboard
  if (!firstSegment || firstSegment === 'dashboard') {
    return { current: 'Dashboard' };
  }

  // Jika halaman merupakan turunan dari pelanggan
  const pelangganChildPages = ['tambahpelanggan', 'editpelanggan', 'uploaddata'];
  if (pelangganChildPages.includes(firstSegment)) {
    return {
      parent: 'Pelanggan',
      parentPath: '/pelanggan',
      current: pageMap[firstSegment] || capitalize(firstSegment),
    };
  }

  // Default - hanya 1 level breadcrumb
  return {
    current: pageMap[firstSegment] || capitalize(firstSegment),
  };
};

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const breadcrumb = getBreadcrumb(location.pathname);

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="text-sm text-gray-500">
        {breadcrumb.parent ? (
          <>
            <Link to={breadcrumb.parentPath} className="hover:text-purple-600 transition-colors">
              {breadcrumb.parent}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-semibold">{breadcrumb.current}</span>
          </>
        ) : (
          <span className="text-gray-900 font-semibold">{breadcrumb.current}</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        

        {/* User Menu - Show different content based on authentication */}
        {isAuthenticated() ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-purple-700 transition-colors bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-full"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:block max-w-24 truncate">
                {currentUser?.email?.split('@')[0] || 'User'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-20">
                {/* User Info */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {currentUser?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentUser?.email}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Pengaturan Profil
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-purple-700 transition-colors">
            <User className="w-4 h-4" />
            <Link to="/login">Sign In</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;