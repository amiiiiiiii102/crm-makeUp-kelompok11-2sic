// pages/HalamanChatPelanggan.jsx
import React from 'react';
import ChatPelanggan from './ChatPelanggan';
import { useAuth } from '../pages/auth/AuthContext';

const HalamanChatPelanggan = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div className="p-6 text-center text-gray-500 italic">Memuat data admin...</div>;
  }

  return <ChatPelanggan adminId={currentUser.id} />;
};

export default HalamanChatPelanggan;
