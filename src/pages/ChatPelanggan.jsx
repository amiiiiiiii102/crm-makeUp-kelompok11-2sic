import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, ArrowLeft, Send, Edit3, Clock, CheckCheck } from 'lucide-react';
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
  const chatListRef = useRef(null);

  const formatTime = iso => {
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!adminId) return;

    const fetchChats = async () => {
      const { data: convs } = await supabase
        .from('conversations')
        .select('*')
        .eq('admin_id', adminId);

      const userIds = convs.map(c => c.user_id);
      const { data: users } = await supabase
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
        email: users.find(u => u.id === conv.user_id)?.email || `User ID: ${conv.user_id}`,
        unreadCount: unreadMap[conv.id] || 0,
      }));

      setChats(chatsWithEmail);
    };

    fetchChats();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, [adminId]);

  useEffect(() => {
    if (!selectedUser || !adminId) return;

    const fetchAndSetMessages = async () => {
      const { data: conv } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', selectedUser)
        .eq('admin_id', adminId)
        .maybeSingle();

      if (!conv) {
        setSelectedMessages([]);
        return;
      }

      await supabase
        .from('pesan')
        .update({ is_read: true })
        .eq('conversation_id', conv.id)
        .eq('sender_role', 'pelanggan')
        .eq('is_read', false);

      const { data: pesanList } = await supabase
        .from('pesan')
        .select('*')
        .eq('conversation_id', conv.id)
        .order('sent_at', { ascending: true });

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

    fetchAndSetMessages();

    const messageChannel = supabase
      .channel(`chat_messages_${selectedUser}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pesan',
        filter: `user_id=eq.${selectedUser}`,
      }, fetchAndSetMessages)
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [selectedUser, adminId]);

  useEffect(() => {
    if (isChatRoom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedMessages, isChatRoom]);

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
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({
          user_id: selectedUser,
          admin_id: adminId,
          started_at: new Date().toISOString(),
        })
        .select('id')
        .single();
      convId = newConv?.id;
    }

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
        sent_at: new Date().toISOString(),
        is_read: false,
      });
    }

    setInputText('');
  };

  return (
    <div className="absolute inset-0 top-[64px] left-[240px] right-0 bottom-0 bg-gray-50 z-30 overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center space-x-3 sticky top-0 z-10">
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
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <MessageCircle size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">
              {isChatRoom ? `Chat dengan ${selectedUserEmail}` : 'Chat Pelanggan'}
            </h1>
            <p className="text-sm text-gray-500">
              {isChatRoom ? 'Customer Support' : `${chats.length} Percakapan Aktif`}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {isChatRoom ? (
            <div className="h-full flex flex-col">
              <div className="flex-1 p-6 space-y-4 overflow-y-aut">
                {selectedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end space-x-2 ${
                      msg.from === 'admin' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.from === 'pelanggan' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-xs font-semibold text-white">
                        {selectedUserEmail?.[0]?.toUpperCase() || 'P'}
                      </div>
                    )}

                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.from === 'admin'
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}>
                      <p className="text-sm font-medium mb-1 opacity-75">
                        {msg.from === 'admin' ? 'Admin' : 'Pelanggan'}
                      </p>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div className={`flex items-center justify-between mt-2 pt-2 ${msg.from === 'admin' ? 'border-t border-gray-200 border-opacity-20' : 'border-t border-gray-200'}`}>
                        <div className="flex items-center space-x-1 text-xs opacity-75">
                          <Clock size={12} />
                          <span>{msg.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {msg.from === 'admin' && (
                            <button
                              onClick={() => {
                                setInputText(msg.text);
                                setEditMode({ msgId: msg.id });
                              }}
                              className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
                            >
                              <Edit3 size={12} />
                            </button>
                          )}
                          {msg.from === 'pelanggan' && (
                            <div className="flex items-center space-x-1 text-xs">
                              <CheckCheck size={12} className={msg.is_read ? 'text-green-500' : 'text-gray-400'} />
                              <span className={msg.is_read ? 'text-green-500' : 'text-gray-400'}>
                                {msg.is_read ? 'Dibaca' : 'Terkirim'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {msg.from === 'admin' && (
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-xs font-semibold text-white">
                        A
                      </div>
                    )}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

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
            <div className="flex-1 p-6" ref={chatListRef}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 shrink-0">
                  <h2 className="text-lg font-semibold text-gray-900">Daftar Percakapan</h2>
                  <p className="text-sm text-gray-600 mt-1">Kelola semua percakapan dengan pelanggan</p>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
                  {chats.length ? (
                    chats.map((chat, i) => (
                      <div key={chat.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center">
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
                    ))
                  ) : (
                    <div className="px-6 py-12 text-center">
                      <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada percakapan</h3>
                      <p className="text-gray-600">Percakapan dengan pelanggan akan muncul di sini</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPelanggan;
