import React, { useState } from 'react'

const initialArticles = [
  {
    id: 1,
    title: 'Manfaat Skincare untuk Remaja',
    url: '/artikel/manfaat-skincare-remaja',
    description: 'Penjelasan singkat tentang pentingnya skincare sejak remaja.',
    status: 'published',
  },
  {
    id: 2,
    title: 'Tips Memilih Sunscreen yang Tepat',
    url: '/artikel/tips-memilih-sunscreen',
    description: 'Cara menentukan sunscreen sesuai dengan jenis kulit.',
    status: 'draft',
  },
]

const Artikel = () => {
  const [articles, setArticles] = useState(initialArticles)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    url: '',
    description: '',
    status: 'draft',
  })

  const handleEdit = (article) => {
    setFormData(article)
    setIsEditing(true)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setArticles(articles.filter((item) => item.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      setArticles((prev) =>
        prev.map((item) => (item.id === formData.id ? { ...formData } : item))
      )
    } else {
      setArticles((prev) => [...prev, { ...formData, id: Date.now() }])
    }

    setFormData({
      id: null,
      title: '',
      url: '',
      description: '',
      status: 'draft',
    })
    setIsEditing(false)
    setShowForm(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#C0360C] mb-4">Daftar Artikel</h2>

      {!showForm && (
        <>
          <div className="grid gap-4 mb-6">
            {articles.map((article) => (
              <div key={article.id} className="border p-4 rounded shadow-sm">
                <h3 className="text-lg font-semibold text-[#C0360C]">{article.title}</h3>
                <p className="text-sm text-gray-600">{article.url}</p>
                <p className="my-1">{article.description}</p>
                <p className="text-sm italic text-gray-500">Status: {article.status}</p>
                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => handleEdit(article)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            className="bg-[#C0360C] text-white px-4 py-2 rounded hover:bg-[#A42C07]"
            onClick={() => {
              setFormData({
                id: null,
                title: '',
                url: '',
                description: '',
                status: 'draft',
              })
              setIsEditing(false)
              setShowForm(true)
            }}
          >
            Tambah Artikel
          </button>
        </>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            {isEditing ? 'Edit Artikel' : 'Tambah Artikel Baru'}
          </h3>
          <input
            type="text"
            placeholder="Judul Artikel"
            className="w-full p-2 border rounded"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="URL Artikel"
            className="w-full p-2 border rounded"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            required
          />
          <textarea
            placeholder="Deskripsi Singkat"
            className="w-full p-2 border rounded"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <select
            className="w-full p-2 border rounded"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-[#C0360C] text-white px-4 py-2 rounded hover:bg-[#A42C07]"
            >
              {isEditing ? 'Update Artikel' : 'Simpan Artikel'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setFormData({ id: null, title: '', url: '', description: '', status: 'draft' })
                setIsEditing(false)
              }}
              className="text-[#C0360C] border border-[#C0360C] px-4 py-2 rounded hover:bg-[#FFEDE5]"
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Artikel
