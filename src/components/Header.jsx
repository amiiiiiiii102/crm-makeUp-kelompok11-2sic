import { Search, User } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'

const Header = () => {
  const location = useLocation();
  
  const getBreadcrumb = (pathname) => {
    const segments = pathname.split('/').filter(Boolean);
    
    const pageMap = {
      'dashboard': 'Dashboard',
      'pelanggan': 'Pelanggan',
      'produk': 'Produk',
      'penjualan': 'Penjualan',
      'ProductForm': 'Form Produk',
      'ChatPelanggan': 'Chat Pelanggan',
      'FAQ': 'FAQ'
    };

    // For dashboard page
    if (segments.length === 0 || pathname === '/dashboard') {
      return {
        current: 'Dashboard'
      };
    }

    // For pelanggan related routes
    if (segments[0] === 'pelanggan' || segments[0] === 'tambahpelanggan' || segments[0] === 'editpelanggan') {
      if (segments[0] === 'tambahpelanggan') {
        return {
          parent: 'Pelanggan',
          parentPath: '/pelanggan',
          current: 'Tambah Pelanggan'
        };
      }
      if (segments[0] === 'editpelanggan') {
        return {
          parent: 'Pelanggan',
          parentPath: '/pelanggan',
          current: 'Edit Pelanggan'
        };
      }
    }

    // For other pages
    return {
      current: pageMap[segments[0]] || segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
    };
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
        <div className="relative">
          <input
            type="text"
            placeholder="Type here..."
            className="px-4 py-2 pl-10 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
        
        <div className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-purple-700 transition-colors">
          <User className="w-4 h-4" />
          <Link to="/login">Sign In</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;