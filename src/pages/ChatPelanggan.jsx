import React, { useState } from 'react'
import { MessageCircle } from 'lucide-react'

const initialChats = [
  {
    id: 1,
    user: 'budi123',
    messages: [
      { from: 'user', text: 'Apakah produk ini cocok untuk kulit berminyak?', time: '10:21' },
    ],
  },
  {
    id: 2,
    user: 'sari456',
    messages: [
      { from: 'user', text: 'Berapa lama tahan foundation ini setelah diaplikasikan?', time: '10:23' },
    ],
  },
]

const ChatPelanggan = () => {
  const [chats, setChats] = useState(initialChats)
  const [selectedUser, setSelectedUser] = useState(null)
  const [inputText, setInputText] = useState('')
  const [editMode, setEditMode] = useState({ chatId: null, msgIndex: null })
  const [isChatRoom, setIsChatRoom] = useState(false)

  const getCurrentTime = () => {
    const now = new Date()
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  }

  const handleSend = () => {
    if (!inputText.trim()) return

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.user === selectedUser) {
          const updatedMessages = [...chat.messages]

          if (editMode.chatId === chat.id && editMode.msgIndex !== null) {
            updatedMessages[editMode.msgIndex].text = inputText
            updatedMessages[editMode.msgIndex].time = getCurrentTime()
          } else {
            updatedMessages.push({
              from: 'admin',
              text: inputText,
              time: getCurrentTime(),
            })
          }

          return { ...chat, messages: updatedMessages }
        }
        return chat
      })
    )

    setInputText('')
    setEditMode({ chatId: null, msgIndex: null })
  }

  const handleEdit = (chatId, msgIndex, oldText) => {
    setInputText(oldText)
    setEditMode({ chatId, msgIndex })
  }

  const selectedChat = chats.find((c) => c.user === selectedUser)

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-extrabold flex items-center gap-3 text-[#C0360C]">
          <MessageCircle size={28} />
          Chat Pelanggan
        </h2>
        {isChatRoom && (
          <button
            className="bg-[#C0360C] text-white px-4 py-2 rounded-md hover:bg-[#A42C07]"
            onClick={() => {
              setIsChatRoom(false)
              setSelectedUser(null)
              setInputText('')
              setEditMode({ chatId: null, msgIndex: null })
            }}
          >
            Kembali ke Daftar
          </button>
        )}
      </div>

      {isChatRoom ? (
        // Chat Room View
        <div className="h-[70vh] border border-gray-200 rounded-lg overflow-hidden p-6 flex flex-col justify-between">
          {selectedChat ? (
            <>
              <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {selectedChat.messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`p-4 rounded-xl max-w-md shadow ${
                        msg.from === 'user'
                          ? 'bg-[#FFEDE5] border border-[#FFC4A8] text-[#C0360C]'
                          : 'bg-[#FFDACC] border border-[#FFAD8F] text-[#5E2C1B]'
                      }`}
                    >
                      <p className="text-sm font-semibold mb-1">
                        {msg.from === 'user' ? selectedChat.user : 'Admin'}
                      </p>
                      <p>{msg.text}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">{msg.time}</span>
                        {msg.from === 'admin' && (
                          <button
                            className="text-xs text-blue-600 ml-2 hover:underline"
                            onClick={() => handleEdit(selectedChat.id, idx, msg.text)}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-4 items-end">
                <input
                  type="text"
                  placeholder="Tulis pesan..."
                  className="flex-grow border border-[#FFC4A8] p-3 rounded-lg focus:ring-2 focus:ring-[#FF8759]"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button
                  onClick={handleSend}
                  className="bg-[#C0360C] hover:bg-[#A42C07] text-white px-5 py-2 rounded-lg"
                >
                  {editMode.chatId ? 'Update' : 'Kirim'}
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">Pilih salah satu pertanyaan untuk mulai membalas.</p>
          )}
        </div>
      ) : (
        // List View as Table
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-[#FFF4F1] text-[#C0360C]">
              <tr>
                <th className="p-3 text-left">No</th>
                <th className="p-3 text-left">Nama Pengguna</th>
                <th className="p-3 text-left">Pesan Terakhir</th>
                <th className="p-3 text-left">Waktu</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {chats.length > 0 ? (
                chats.map((chat, index) => {
                  const lastMsg = chat.messages[chat.messages.length - 1]
                  return (
                    <tr key={chat.id} className="border-t hover:bg-[#FFF7F5]">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 font-medium text-[#C0360C]">{chat.user}</td>
                      <td className="p-3 text-gray-700">
                        {lastMsg.text.length > 60
                          ? lastMsg.text.slice(0, 60) + '...'
                          : lastMsg.text}
                      </td>
                      <td className="p-3 text-gray-500">{lastMsg.time}</td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setSelectedUser(chat.user)
                            setIsChatRoom(true)
                          }}
                          className="text-sm text-white bg-[#C0360C] hover:bg-[#A42C07] px-4 py-1 rounded-md"
                        >
                          Balas
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500 italic">
                    Belum ada chat dari pelanggan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ChatPelanggan
