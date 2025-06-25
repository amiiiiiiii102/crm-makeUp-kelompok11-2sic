import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, ArrowLeft, Send, Edit3, Users, Clock, CheckCheck } from 'lucide-react';
import { supabase } from '../supabase';

const ChatPelanggan = ({ adminId }) => {
  const [chats, setChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [editMode, setEditMode] = useState({ msgId: null });
  const [isChatRoom, setIsChatRoom] = useState(false);
  const bottomRef = useRef(null);

  const formatTime = iso => {
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!adminId) return;

    const fetchChats = async () => {
      const { data: convs, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('admin_id', adminId);

      if (error || !convs?.length) return;

      const userIds = convs.map(c => c.user_id);
      const { data: users, error: userErr } = await supabase
        .from('users')
        .select('id, email')
        .in('id', userIds);

      const { data: unreadPesan } = await supabase
        .from('pesan')
        .select('conversation_id')
        .eq('sender_role', 'pelanggan')
        .eq('is_read', false);

      const unreadMap = unreadPesan?.reduce((acc, curr) => {
        acc[curr.conversation_id] = (acc[curr.conversation_id] || 0) + 1;
        return acc;
      }, {}) || {};

      const chatsWithEmail = convs.map(conv => ({
        ...conv,
        email: users.find(u => u.id === conv.user_id)?.email || 'Unknown',
        unreadCount: unreadMap[conv.id] || 0,
      }));

      setChats(chatsWithEmail);
    };

    fetchChats();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, [adminId]);

  const loadMessages = async userId => {
    const { data: conv, error } = await supabase
      .from('conversations')
      .select('id')
      .eq('user_id', userId)
      .eq('admin_id', adminId)
      .maybeSingle();

    if (error || !conv) return;

    await supabase
      .from('pesan')
      .update({ is_read: true })
      .eq('conversation_id', conv.id)
      .eq('sender_role', 'pelanggan')
      .eq('is_read', false);

    const { data: pesanList, error: pesanErr } = await supabase
      .from('pesan')
      .select('*')
      .eq('conversation_id', conv.id)
      .order('sent_at', { ascending: true });

    if (pesanErr) return;

    setSelectedMessages(
      pesanList.map(m => ({
        id: m.id,
        from: m.sender_role,
        text: m.message,
        time: formatTime(m.sent_at),
        is_read: m.is_read,
      }))
    );
  };

  useEffect(() => {
    if (selectedUser && adminId) {
      loadMessages(selectedUser);
      const interval = setInterval(() => loadMessages(selectedUser), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUser, adminId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedMessages]);

  const handleSend = async () => {
    if (!inputText.trim() || !selectedUser) return;

    const { data: conv } = await supabase
      .from('conversations')
      .select('id')
      .eq('user_id', selectedUser)
      .eq('admin_id', adminId)
      .maybeSingle();

    let convId = conv?.id;

    if (!convId) {
      const { data: newConv, error: convErr } = await supabase
        .from('conversations')
        .insert({
          user_id: selectedUser,
          admin_id: adminId,
          started_at: new Date(),
        })
        .select('id')
        .single();

      if (convErr) return;
      convId = newConv?.id;
    }

    if (!convId) return;

    if (editMode.msgId) {
      await supabase
        .from('pesan')
        .update({ message: inputText })
        .eq('id', editMode.msgId);
      setEditMode({ msgId: null });
    } else {
      await supabase.from('pesan').insert({
        conversation_id: convId,
        user_id: selectedUser,
        admin_id: adminId,
        sender_role: 'admin',
        message: inputText,
        sent_at: new Date(),
        is_read: false,
      });
    }

    setInputText('');
    await loadMessages(selectedUser);
  };

  const handleEdit = (msgId, oldText) => {
    setInputText(oldText);
    setEditMode({ msgId });
  };

  if (!adminId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isChatRoom && (
                <button
                  onClick={() => {
                    setIsChatRoom(false);
                    setSelectedUser(null);
                    setSelectedUserEmail('');
                    setSelectedMessages([]);
                    setInputText('');
                    setEditMode({ msgId: null });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
              )}
              <div className="flex items-center space-x-2">
  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
    <MessageCircle size={20} className="text-white" />
  </div>
  <div>
    <h1 className="text-xl font-semibold text-gray-900">
      {isChatRoom ? selectedUserEmail : 'Chat Pelanggan'}
    </h1>
    {isChatRoom && (
      <p className="text-sm text-gray-500">Customer Support</p>
    )}
  </div>
</div>

            </div>
            {!isChatRoom && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users size={16} />
                <span>{chats.length} Percakapan</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isChatRoom ? (
            <div className="h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.from === 'pelanggan' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.from === 'pelanggan'
                        ? 'bg-white border border-gray-200 text-gray-800'
                        : 'bg-orange-500 text-white'
                    }`}>
                      <p className="text-sm font-medium mb-1 opacity-75">
                        {msg.from === 'pelanggan' ? 'Pelanggan' : 'Admin'}
                      </p>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 border-opacity-20">
                        <div className="flex items-center space-x-1 text-xs opacity-75">
                          <Clock size={12} />
                          <span>{msg.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {msg.from === 'admin' && (
                            <button
                              onClick={() => handleEdit(msg.id, msg.text)}
                              className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
                            >
                              <Edit3 size={12} />
                            </button>
                          )}
                          {msg.from === 'pelanggan' && (
                            <div className="flex items-center space-x-1 text-xs">
                              <CheckCheck size={12} className={msg.is_read ? 'text-orange-400' : 'text-gray-400'} />
                              <span className={msg.is_read ? 'text-orange-400' : 'text-gray-400'}>
                                {msg.is_read ? 'Dibaca' : 'Terkirim'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-6 bg-white border-t border-gray-200">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Tulis pesan..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleSend()}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="px-6 py-3 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <Send size={16} />
                    <span>{editMode.msgId ? 'Update' : 'Kirim'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Daftar Percakapan</h2>
                  <p className="text-sm text-gray-600 mt-1">Kelola semua percakapan dengan pelanggan</p>
                </div>
                
                {chats.length ? (
                  <div className="divide-y divide-gray-200">
                    {chats.map((chat, i) => (
                      <div key={chat.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {chat.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-gray-900">{chat.email}</h3>
                                {chat.unreadCount > 0 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    {chat.unreadCount} baru
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">Pelanggan #{i + 1}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedUser(chat.user_id);
                              setSelectedUserEmail(chat.email);
                              setIsChatRoom(true);
                            }}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                          >
                            Buka Chat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada percakapan</h3>
                    <p className="text-gray-600">Percakapan dengan pelanggan akan muncul di sini</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPelanggan;