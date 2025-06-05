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
            // Edit mode
            updatedMessages[editMode.msgIndex].text = inputText
            updatedMessages[editMode.msgIndex].time = getCurrentTime()
          } else {
            // New message
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
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-3 text-[#C0360C]">
        <MessageCircle size={28} />
        Chat Pelanggan
      </h2>

      <div className="flex h-[70vh] border border-gray-200 rounded-lg overflow-hidden">
        {/* Sidebar User */}
        <div className="w-1/3 border-r border-gray-300 bg-[#FFF7F3] p-4 overflow-y-auto">
          <h4 className="font-bold mb-3 text-[#C0360C]">Daftar User</h4>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setSelectedUser(chat.user)
                setInputText('')
                setEditMode({ chatId: null, msgIndex: null })
              }}
              className={`p-3 rounded-md cursor-pointer hover:bg-[#FFE3D9] mb-2 ${
                selectedUser === chat.user ? 'bg-[#FFD2B5]' : ''
              }`}
            >
              <p className="font-semibold text-[#C0360C]">{chat.user}</p>
              <p className="text-sm text-gray-600 italic">
                {chat.messages[chat.messages.length - 1].text.slice(0, 30)}...
              </p>
            </div>
          ))}
        </div>

        {/* Chat Room */}
        <div className="w-2/3 p-6 flex flex-col justify-between">
          {selectedChat ? (
            <>
              {/* Chat bubble list */}
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

              {/* Input form */}
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
            <p className="text-gray-500 italic">Pilih salah satu user untuk mulai chat.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatPelanggan
