import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../pages/auth/AuthContext'

const ChatUser = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState(null)
  const { currentUser } = useAuth()
  const [adminId, setAdminId] = useState(null)

  const formatTime = iso => {
    const d = new Date(iso)
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  }

  // Ambil satu admin (untuk dikaitkan dengan conversation)
  useEffect(() => {
    const fetchAdmin = async () => {
      const { data, error } = await supabase
        .from('admin')
        .select('id')
        .limit(1)
        .maybeSingle()

      if (data) {
        setAdminId(data.id)
      } else {
        console.error('Gagal mendapatkan admin:', error)
      }
    }

    fetchAdmin()
  }, [])

  // Ambil pesan & polling setiap 5 detik
  useEffect(() => {
    if (!currentUser?.id || !adminId) return

    const fetchMessages = async () => {
      const { data: conv, error } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('admin_id', adminId)
        .maybeSingle()

      if (error) {
        console.error('Gagal mengambil percakapan:', error)
        return
      }

      if (conv) {
        setConversationId(conv.id)

        const { data: pesan, error: pesanErr } = await supabase
          .from('pesan')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('sent_at', { ascending: true })

        if (pesanErr) {
          console.error('Gagal mengambil pesan:', pesanErr)
        } else {
          setMessages(
            pesan.map(m => ({
              id: m.id,
              text: m.message,
              from: m.sender_role,
              time: formatTime(m.sent_at),
            }))
          )
        }
      }
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)

    return () => clearInterval(interval)
  }, [currentUser, adminId])

  const sendMessage = async () => {
    if (!input.trim() || !currentUser || !adminId) return

    let convId = conversationId

    // Cek apakah conversation sudah ada
    if (!convId) {
      const { data: existingConv, error: findError } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('admin_id', adminId)
        .maybeSingle()

      if (findError) {
        console.error('Gagal mengecek conversation:', findError)
        return
      }

      if (existingConv) {
        convId = existingConv.id
        setConversationId(convId)
      } else {
        // Buat baru
        const { data: newConv, error: insertError } = await supabase
          .from('conversations')
          .insert({
            user_id: currentUser.id,
            admin_id: adminId,
            started_at: new Date(),
          })
          .select('id')
          .single()

        if (insertError) {
          console.error('Gagal membuat percakapan:', insertError)
          return
        }

        convId = newConv.id
        setConversationId(convId)
      }
    }

    // Kirim pesan
    const { error: sendError } = await supabase.from('pesan').insert({
      conversation_id: convId,
      user_id: currentUser.id,
      admin_id: adminId,
      sender_role: 'pelanggan',
      message: input,
      sent_at: new Date(),
      is_read: false,
    })

    if (sendError) {
      console.error('Gagal mengirim pesan:', sendError)
    } else {
      setInput('')
    }
  }

  // Jangan tampilkan form jika user belum login atau belum dapat admin
  if (!currentUser || !adminId || currentUser.isAdmin) return null

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-[#C0360C]">Chat dengan Admin</h2>

      <div className="h-96 overflow-y-auto border p-4 rounded space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.from === 'pelanggan' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-xl max-w-xs shadow ${
                msg.from === 'pelanggan' ? 'bg-[#FFDACC]' : 'bg-[#FFF1ED]'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs text-gray-500 text-right mt-1">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="Tulis pesan..."
        />
        <button
          onClick={sendMessage}
          className="bg-[#C0360C] text-white px-4 py-2 rounded hover:bg-[#A42C07]"
        >
          Kirim
        </button>
      </div>
    </div>
  )
}

export default ChatUser
