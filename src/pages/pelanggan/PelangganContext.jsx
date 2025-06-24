import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../../Supabase'; // Sesuaikan path ke file supabase Anda

export const PelangganContext = createContext();

export const PelangganProvider = ({ children }) => {
  const [pelanggan, setPelanggan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data dari Supabase saat komponen pertama kali dimuat
  useEffect(() => {
    loadPelangganFromSupabase();
  }, []);

  // Fungsi untuk load data dari Supabase
  const loadPelangganFromSupabase = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pelanggan')
        .select('*')
        .order('tanggalbergabung', { ascending: false });

      if (error) {
        console.error('Error loading pelanggan:', error);
        return;
      }

      setPelanggan(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Fungsi hapus - update untuk Supabase
  const hapusPelanggan = async (pelanggan_id) => {
    try {
      // Hapus dari Supabase
      const { error } = await supabase
        .from('pelanggan')
        .delete()
        .eq('pelanggan_id', pelanggan_id); // Gunakan 'id' sesuai dengan primary key di database

      if (error) {
        console.error('Error deleting pelanggan:', error);
        alert('Gagal menghapus pelanggan');
        return;
      }

      // Update state lokal
      const filtered = pelanggan.filter((pelanggan) => pelanggan.id !== pelanggan_id);
      setPelanggan(filtered);
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menghapus pelanggan');
    }
  };

  // ✅ Fungsi edit - update untuk Supabase
  const editPelanggan = async (pelanggan_id, dataBaru) => {
    try {
      // Update di Supabase
      const { data, error } = await supabase
        .from('pelanggan')
        .update(dataBaru)
        .eq('pelanggan_id', pelanggan_id) // Gunakan 'id' sesuai dengan primary key di database
        .select();

      if (error) {
        console.error('Error updating pelanggan:', error);
        alert('Gagal mengupdate pelanggan');
        return;
      }

      // Update state lokal
      const updated = pelanggan.map((pelanggan) =>
        pelanggan.id === pelanggan_id ? { ...pelanggan, ...dataBaru } : pelanggan
      );
      setPelanggan(updated);
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengupdate pelanggan');
    }
  };

  // Fungsi tambahan untuk menambah pelanggan (untuk digunakan di form tambah)
  const tambahPelanggan = async (pelangganBaru) => {
    try {
      const { data, error } = await supabase
        .from('pelanggan')
        .insert([pelangganBaru])
        .select();

      if (error) {
        console.error('Error adding pelanggan:', error);
        throw error;
      }

      // Update state lokal
      setPelanggan(prev => [data[0], ...prev]);
      return data[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  return (
    <PelangganContext.Provider
      value={{
        pelanggan,
        setPelanggan,
        hapusPelanggan, // ✅ Masukkan ke context
        editPelanggan,  // ✅ Masukkan ke context
        tambahPelanggan, // ✅ Fungsi tambahan untuk menambah pelanggan
        loadPelangganFromSupabase, // ✅ Fungsi untuk refresh data
        isLoading, // ✅ Status loading
      }}
    >
      {children}
    </PelangganContext.Provider>
  );
};