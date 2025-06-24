import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import PemesananForm from './PemesananForm';

function ListPemesanan() {
  const [pemesananList, setPemesananList] = useState([]);
  const [editingPemesanan, setEditingPemesanan] = useState(null);

  const fetchPemesanans = async () => {
    const { data, error } = await supabase
      .from('pemesanan')
      .select(`*, pelanggan(nama), detail_pemesanan(*, produk(name))`)
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setPemesananList(data);
  };

  const addPemesanan = async ({ pemesananData, detailData }) => {
    const { data, error } = await supabase
      .from('pemesanan')
      .insert([pemesananData])
      .select();

    if (error) {
      console.error('Gagal insert pemesanan:', error);
      return;
    }

    const insertedId = data[0].id_pemesanan;

    const detailWithFK = detailData.map((item) => ({
      ...item,
      id_pemesanan: insertedId,
    }));

    const { error: detailError } = await supabase
      .from('detail_pemesanan')
      .insert(detailWithFK);

    if (detailError) console.error('Gagal insert detail:', detailError);

    fetchPemesanans();
  };

  const updatePemesanan = async ({ pelanggan_id, alamat, metode_pembayaran, status, total, detail, id_pemesanan }) => {
    const { error } = await supabase
      .from('pemesanan')
      .update({ pelanggan_id, alamat, metode_pembayaran, status, total })
      .eq('id_pemesanan', id_pemesanan);

    if (error) {
      console.error('Gagal update pemesanan:', error);
      return;
    }

    // Hapus detail lama
    await supabase.from('detail_pemesanan').delete().eq('id_pemesanan', id_pemesanan);

    // Tambah detail baru
    const detailWithFK = detail.map((item) => ({ ...item, id_pemesanan }));
    await supabase.from('detail_pemesanan').insert(detailWithFK);

    setEditingPemesanan(null);
    fetchPemesanans();
  };

  const deletePemesanan = async (id_pemesanan) => {
    const { error } = await supabase.from('pemesanan').delete().eq('id_pemesanan', id_pemesanan);
    if (error) console.error('Gagal hapus pemesanan:', error);
    else fetchPemesanans();
  };

  useEffect(() => {
    fetchPemesanans();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manajemen Pemesanan</h1>
      <PemesananForm
        addPemesanan={addPemesanan}
        updatePemesanan={updatePemesanan}
        editingPemesanan={editingPemesanan}
      />

      <ul className="mt-6 space-y-4">
        {pemesananList.map((pesanan) => (
          <li key={pesanan.id_pemesanan} className="border rounded p-4 shadow-sm bg-white">
            <div>
              <p><strong>Pelanggan:</strong> {pesanan.pelanggan?.nama || 'Tidak ditemukan'}</p>
              <p><strong>Alamat:</strong> {pesanan.alamat}</p>
              <p><strong>Status:</strong> {pesanan.status}</p>
              <p><strong>Metode Pembayaran:</strong> {pesanan.metode_pembayaran}</p>
              <p><strong>Total:</strong> Rp{pesanan.total?.toLocaleString()}</p>
              <p><strong>Dibuat:</strong> {new Date(pesanan.created_at).toLocaleString()}</p>
            </div>
            <div className="mt-2">
              <p className="font-semibold">Detail Pesanan:</p>
              <ul className="list-disc ml-5">
                {pesanan.detail_pemesanan?.map((item, index) => (
                  <li key={index}>
                    Produk: {item.produk?.name || 'Tidak ditemukan'} | Jumlah: {item.jumlah} | Harga: Rp{item.harga?.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-3 flex gap-4">
              <button
                onClick={() => setEditingPemesanan({ ...pesanan, detail: detail_pemesanan.map(d => ({
                  id_produk: d.id_produk,
                  jumlah: d.jumlah,
                  harga: d.harga
                })) })}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deletePemesanan(id_pemesanan)}
                className="text-red-600 hover:underline"
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListPemesanan;
