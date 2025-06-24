import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const PemesananForm = ({ addPemesanan, editingPemesanan }) => {
  const [form, setForm] = useState({
    pelanggan_id: '',
    alamat: '',
    metode_pembayaran: 'transfer_bank',
    status: 'pending',
    total: 0,
    detail: [{ id_produk: '', jumlah: 1, harga: 0 }]
  });

  const [pelangganList, setPelangganList] = useState([]);
  const [produkList, setProdukList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: pelanggan } = await supabase.from('pelanggan').select('pelanggan_id, nama');
      const { data: produk } = await supabase.from('produk').select('id_produk, name, price');
      setPelangganList(pelanggan || []);
      setProdukList(produk || []);
    };
    fetchData();
  }, []);

  const updateTotal = (detail) => {
    const total = detail.reduce((sum, item) => sum + (item.jumlah * item.harga), 0);
    setForm(prev => ({ ...prev, total }));
  };

  const handleDetailChange = (index, field, value) => {
    const newDetail = [...form.detail];
    if (field === 'id_produk') {
      const selected = produkList.find(p => p.id_produk === value);
      newDetail[index].id_produk = value;
      newDetail[index].harga = selected ? selected.price : 0;
    } else {
      newDetail[index][field] = parseInt(value) || 0;
    }
    setForm(prev => ({ ...prev, detail: newDetail }));
    updateTotal(newDetail);
  };

  const addDetailRow = () => {
    setForm(prev => ({
      ...prev,
      detail: [...prev.detail, { id_produk: '', jumlah: 1, harga: 0 }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pemesananData = {
      pelanggan_id: form.pelanggan_id,
      alamat: form.alamat,
      metode_pembayaran: form.metode_pembayaran,
      status: form.status,
      total: form.total
    };
    const detailData = form.detail;
    await addPemesanan({ pemesananData, detailData });
    setForm({
      pelanggan_id: '',
      alamat: '',
      metode_pembayaran: 'transfer_bank',
      status: 'pending',
      total: 0,
      detail: [{ id_produk: '', jumlah: 1, harga: 0 }]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded shadow-sm bg-white">
      <h2 className="text-lg font-semibold text-gray-800">Tambah Pemesanan</h2>

      <select
        className="w-full p-2 border rounded"
        value={form.pelanggan_id}
        onChange={e => setForm({ ...form, pelanggan_id: e.target.value })}
        required
      >
        <option value="">Pilih Pelanggan</option>
        {pelangganList.map(p => (
          <option key={p.pelanggan_id} value={p.pelanggan_id}>{p.nama}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Alamat"
        className="w-full p-2 border rounded"
        value={form.alamat}
        onChange={e => setForm({ ...form, alamat: e.target.value })}
        required
      />

      <select
        className="w-full p-2 border rounded"
        value={form.metode_pembayaran}
        onChange={e => setForm({ ...form, metode_pembayaran: e.target.value })}
      >
        <option value="transfer_bank">Transfer Bank</option>
        <option value="cod">Cash on Delivery</option>
        <option value="e_wallet">E-Wallet</option>
      </select>

      <select
        className="w-full p-2 border rounded"
        value={form.status}
        onChange={e => setForm({ ...form, status: e.target.value })}
      >
        <option value="pending">Pending</option>
        <option value="diproses">Diproses</option>
        <option value="dikirim">Dikirim</option>
        <option value="selesai">Selesai</option>
        <option value="batal">Batal</option>
      </select>

      <div className="space-y-2">
        <h3 className="text-md font-medium text-gray-700">Detail Pemesanan</h3>
        {form.detail.map((item, index) => (
          <div key={index} className="flex space-x-2">
            <select
              className="w-1/3 p-2 border rounded"
              value={item.id_produk}
              onChange={e => handleDetailChange(index, 'id_produk', e.target.value)}
            >
              <option value="">Pilih Produk</option>
              {produkList.map(p => (
                <option key={p.id_produk} value={p.id_produk}>{p.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Jumlah"
              className="w-1/3 p-2 border rounded"
              value={item.jumlah}
              onChange={e => handleDetailChange(index, 'jumlah', e.target.value)}
            />
            <input
              type="number"
              placeholder="Harga"
              className="w-1/3 p-2 border rounded"
              value={item.harga}
              disabled
            />
          </div>
        ))}
        <button type="button" onClick={addDetailRow} className="text-blue-600 hover:underline">
          + Tambah Produk
        </button>
      </div>

      <input
        type="number"
        placeholder="Total Harga"
        className="w-full p-2 border rounded bg-gray-100"
        value={form.total}
        readOnly
      />

      <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
        Tambah Pemesanan
      </button>
    </form>
  );
};

export default PemesananForm;
