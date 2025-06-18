import React, { useState, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PelangganContext } from '../pelanggan/PelangganContext';
import { Link } from "react-router-dom";


import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  UserPlus,
  FileText,
  Star,
  Shield,
  Clock
} from 'lucide-react';

const Pelanggan = () => {
  const { pelanggan, hapusPelanggan, editPelanggan } = useContext(PelangganContext);
  
const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'nama' , direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedpelanggan, setSelectedpelanggan] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');


  // Filtering and sorting logic
  const filteredAndSortedpelanggan = useMemo(() => {
    let filtered = pelanggan.filter(pelanggan => {
      const matchesSearch = pelanggan.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pelanggan.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pelanggan.noHp.includes(searchTerm);
      
      const matchesTier = tierFilter === 'all' || pelanggan.kategori === tierFilter;
      
      return matchesSearch && matchesTier;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [pelanggan, searchTerm, sortConfig, statusFilter, tierFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedpelanggan.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentpelanggan = filteredAndSortedpelanggan.slice(startIndex, endIndex);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleSelectpelanggan = (pelanggan_id) => {
    setSelectedpelanggan(prev => 
      prev.includes(pelanggan_id) 
        ? prev.filter(id => id !== pelanggan_id)
        : [...prev, pelanggan_id]
    );
  };

  const handleSelectAll = () => {
    setSelectedpelanggan(
      selectedpelanggan.length === currentpelanggan.length 
        ? [] 
        : currentpelanggan.map(pelanggan => pelanggan.pelanggan_id)
    );
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-100 text-purple-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (dateString === 'Never') return dateString;
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Pelanggan</h1>
              <p className="text-gray-600">Kelola informasi dan aktivitas pelanggan</p>
            </div>
            <div className="flex items-center gap-3">

              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" />
               <Link to="/tambahpelanggan" className="text-white">
                Tambah Pelanggan
              </Link>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Pelanggan</p>
                  <p className="text-xl font-semibold text-gray-900">{pelanggan.length}</p>
                </div>
              </div>
            </div>
           
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Premium Members</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {pelanggan.filter(c => ['gold', 'platinum'].includes(c.kategori)).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Baru Bulan Ini</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {pelanggan.filter(c => new Date(c.tanggalBergabung).getMonth() === new Date().getMonth()).length}
                  </p>
                </div>
              </div>
             </div>
       </div>
         

          {/* Filters and Search */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari nama, email, atau nomor telepon..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3">
              
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Semua Tier</option>
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
            </div>
          </div>

        </div>
        

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
  
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('nama')}
                  >
                    <div className="flex items-center gap-1">
                      Pelanggan
                      {sortConfig.key === 'nama' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('tanggalBergabung')}
                  >
                    <div className="flex items-center gap-1">
                      Tanggal Bergabung
                      {sortConfig.key === 'tanggalBergabung' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('totalPesanan')}
                  >
                    <div className="flex items-center gap-1">
                      Total Pesanan
                      {sortConfig.key === 'totalPesanan' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('totalBelanja')}
                  >
                    <div className="flex items-center gap-1">
                      Total Belanja
                      {sortConfig.key === 'totalBelanja' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentpelanggan.map((pelanggan) => (
                  <tr key={pelanggan.pelanggan_id} className="hover:bg-gray-50">
  
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={pelanggan.fotoProfil}
                          alt={pelanggan.nama}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900">{pelanggan.nama}</p>
                            {pelanggan.verified && (
                              <Shield className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {pelanggan.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {pelanggan.noHp}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <MapPin className="w-3 h-3" />
                            {pelanggan.alamat}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(pelanggan.tanggalBergabung)}
                      </div>
                     
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900">{pelanggan.totalPesanan}</p>
                      <p className="text-xs text-gray-500">pesanan</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(pelanggan.totalBelanja)}</p>
                      <p className="text-xs text-gray-500">total belanja</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                      
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTierColor(pelanggan.tier)}`}>
                          {pelanggan.kategori.charAt(0).toUpperCase() + pelanggan.kategori.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                    
                       <button
                                className="cursor-pointer p-1 text-gray-400 hover:text-green-600"
                        onClick={() => navigate(`/editpelanggan/${pelanggan.pelanggan_id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                        <button className="cursor-pointer p-1 text-gray-400 hover:text-red-600"
                        onClick={() => hapusPelanggan(pelanggan.pelanggan_id)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                       
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredAndSortedpelanggan.length)} dari {filteredAndSortedpelanggan.length} pelanggan
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value={10}>10 per halaman</option>
                <option value={25}>25 per halaman</option>
                <option value={50}>50 per halaman</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="px-3 py-1 text-sm">
                Halaman {currentPage} dari {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Pelanggan;