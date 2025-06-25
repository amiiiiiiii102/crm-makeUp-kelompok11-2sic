import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, Clock, CheckCheck } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../pages/auth/AuthContext';

const ChatUser = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const { currentUser } = useAuth();
  const [adminId, setAdminId] = useState(null);

  const formatTime = iso => {
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      const { data, error } = await supabase
        .from('admin')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (data) setAdminId(data.id);
      else console.error('Gagal mendapatkan admin:', error);
    };

    fetchAdmin();
  }, []);

  useEffect(() => {
    if (!currentUser?.id || !adminId) return;

    const fetchMessages = async () => {
      const { data: conv } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('admin_id', adminId)
        .maybeSingle();

      if (conv) {
        setConversationId(conv.id);
        const { data: pesan } = await supabase
          .from('pesan')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('sent_at', { ascending: true });

        setMessages(
          pesan.map(m => ({
            id: m.id,
            text: m.message,
            from: m.sender_role,
            time: formatTime(m.sent_at),
            is_read: m.is_read,
          }))
        );
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [currentUser, adminId]);

  const sendMessage = async () => {
    if (!input.trim() || !currentUser || !adminId) return;
    let convId = conversationId;

    if (!convId) {
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('admin_id', adminId)
        .maybeSingle();

      if (existingConv) {
        convId = existingConv.id;
        setConversationId(convId);
      } else {
        const { data: newConv } = await supabase
          .from('conversations')
          .insert({
            user_id: currentUser.id,
            admin_id: adminId,
            started_at: new Date(),
          })
          .select('id')
          .single();

        convId = newConv.id;
        setConversationId(convId);
      }
    }

    await supabase.from('pesan').insert({
      conversation_id: convId,
      user_id: currentUser.id,
      admin_id: adminId,
      sender_role: 'pelanggan',
      message: input,
      sent_at: new Date(),
      is_read: false,
    });

    setInput('');
  };

  if (!currentUser || !adminId || currentUser.isAdmin) return null;

  return (
    <div className="absolute inset-0 top-[64px] left-[240px] right-0 bottom-0 bg-gray-50 z-30 overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center space-x-3 sticky top-0 z-10">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <MessageCircle size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Chat dengan Admin</h1>
            <p className="text-sm text-gray-500">Layanan Bantuan</p>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end space-x-2 ${
                msg.from === 'pelanggan' ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Avatar for admin messages (left side) */}
              {msg.from === 'admin' && (
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-xs font-semibold text-white">
                  A
                </div>
              )}
              
              {/* Message bubble */}
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                msg.from === 'pelanggan'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}>
                <p className="text-sm font-medium mb-1 opacity-75">
                  {msg.from === 'pelanggan' ? 'Anda' : 'Admin'}
                </p>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 border-opacity-20">
                  <div className="flex items-center space-x-1 text-xs opacity-75">
                    <Clock size={12} />
                    <span>{msg.time}</span>
                  </div>
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

              {/* Avatar for customer messages (right side) */}
              {msg.from === 'pelanggan' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-xs font-semibold text-white">
                  {currentUser.email?.[0]?.toUpperCase() || 'P'}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 bg-white border-t border-gray-200">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Tulis pesan..."
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="px-6 py-3 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Send size={16} />
              <span>Kirim</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUser;