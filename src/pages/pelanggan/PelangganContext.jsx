import React, { createContext, useState, useEffect } from 'react';

export const PelangganContext = createContext();

export const PelangganProvider = ({ children }) => {
  const [pelanggan, setPelanggan] = useState(() => {
    const data = localStorage.getItem('pelanggan');
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    localStorage.setItem('pelanggan', JSON.stringify(pelanggan));
  }, [pelanggan]);

  // ✅ Fungsi hapus
  const hapusPelanggan = (pelanggan_id) => {
    const filtered = pelanggan.filter((pelanggan) => pelanggan.pelanggan_id !== pelanggan_id);
    setPelanggan(filtered);
  };

  // ✅ Fungsi edit
  const editPelanggan = (pelanggan_id, dataBaru) => {
    const updated = pelanggan.map((pelanggan) =>
      pelanggan.pelanggan_id === pelanggan_id ? { ...pelanggan, ...dataBaru } : pelanggan
    );
    setPelanggan(updated);
  };

  return (
    <PelangganContext.Provider
      value={{
        pelanggan,
        setPelanggan,
        hapusPelanggan, // ✅ Masukkan ke context
        editPelanggan,  // ✅ Masukkan ke context
      }}
    >
      {children}
    </PelangganContext.Provider>
  );
};
