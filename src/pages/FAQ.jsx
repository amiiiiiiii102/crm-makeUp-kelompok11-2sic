import { useState } from "react";
import { ChevronDown, ChevronUp, PlusCircle, Trash2, Edit3 } from "lucide-react";

const faqDataDefault = [
  {
    question: "Bagaimana cara membeli produk makeup di Istana Kosmetik?",
    answer: "Cari produk melalui halaman pencarian atau kategori. Klik 'Beli' lalu lanjutkan ke pembayaran di keranjang.",
  },
  {
    question: "Apakah saya bisa konsultasi dulu sebelum membeli produk?",
    answer: "Ya, kamu bisa menggunakan fitur chat langsung dengan apoteker untuk mendapatkan rekomendasi makeup atau skincare.",
  },
];

export default function FAQ() {
  const [faqData, setFaqData] = useState(faqDataDefault);
  const [openIndex, setOpenIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editIndex, setEditIndex] = useState(null); // null = tambah baru

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleShowForm = (index = null) => {
    if (index !== null) {
      setEditIndex(index);
      setNewQuestion(faqData[index].question);
      setNewAnswer(faqData[index].answer);
    } else {
      setEditIndex(null);
      setNewQuestion("");
      setNewAnswer("");
    }
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setNewQuestion("");
    setNewAnswer("");
    setEditIndex(null);
  };

  const handleSave = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const updatedFaq = [...faqData];
    if (editIndex !== null) {
      updatedFaq[editIndex] = { question: newQuestion, answer: newAnswer };
    } else {
      updatedFaq.push({ question: newQuestion, answer: newAnswer });
    }

    setFaqData(updatedFaq);
    handleCancelForm();
  };

  const handleDelete = (index) => {
    if (window.confirm("Yakin ingin menghapus pertanyaan ini?")) {
      const updatedFaq = faqData.filter((_, i) => i !== index);
      setFaqData(updatedFaq);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow-md rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-orange-700 flex items-center gap-2">
          <PlusCircle className="text-orange-600" /> Pusat Bantuan & FAQ
        </h1>
        <button
          onClick={() => (showForm ? handleCancelForm() : handleShowForm())}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition ${
            showForm
              ? "bg-gray-400 text-white hover:bg-gray-500"
              : "bg-orange-600 text-white hover:bg-orange-700"
          }`}
        >
          {showForm ? "Batal" : "Tambah Pertanyaan"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border border-orange-200 rounded-lg bg-orange-50">
          <div className="mb-3">
            <label className="block text-sm font-medium text-orange-700 mb-1">Pertanyaan</label>
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Masukkan pertanyaan"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-orange-700 mb-1">Jawaban</label>
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full border rounded-md p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Masukkan jawaban"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition"
            >
              Simpan
            </button>
            <button
              onClick={handleCancelForm}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="border rounded-md p-4 shadow-sm">
            <div
              onClick={() => toggle(index)}
              className="flex justify-between items-center cursor-pointer"
            >
              <h2 className="font-medium text-orange-800">{faq.question}</h2>
              {openIndex === index ? (
                <ChevronUp className="text-orange-700" />
              ) : (
                <ChevronDown className="text-orange-700" />
              )}
            </div>
            {openIndex === index && (
              <p className="text-sm text-gray-700 mt-2">{faq.answer}</p>
            )}
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => handleShowForm(index)}
                className="cursor-pointer text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <Edit3 size={16} /> Edit
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="cursor-pointer text-sm text-red-600 hover:underline flex items-center gap-1"
              >
                <Trash2 size={16} /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
