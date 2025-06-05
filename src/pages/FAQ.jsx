import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; 

const faqData = [
  {
    question: "Bagaimana cara membeli produk makeup di Istana Kosmetik?",
    answer: "Cari produk melalui halaman pencarian atau kategori. Klik 'Beli' lalu lanjutkan ke pembayaran di keranjang.",
  },
  {
    question: "Apakah saya bisa konsultasi dulu sebelum membeli produk?",
    answer: "Ya, kamu bisa menggunakan fitur chat langsung dengan apoteker untuk mendapatkan rekomendasi makeup atau skincare.",
  },
  {
    question: "Apa saja metode pembayaran yang tersedia di Istana Kosmetik?",
    answer: "Kami mendukung pembayaran via e-wallet (OVO, GoPay, DANA), transfer bank, dan kartu debit/kredit.",
  },
  {
    question: "Apakah produk kosmetik di Istana Kosmetik dijamin asli?",
    answer: "Ya, semua produk yang dijual di Istana Kosmetik berasal dari distributor resmi dan telah memiliki izin BPOM.",
  },
  {
    question: "Bisakah saya membatalkan pesanan setelah checkout?",
    answer: "Bisa, selama status pesanan belum dikonfirmasi oleh sistem. Pembatalan bisa dilakukan dari halaman 'Pesanan Saya'.",
  },
  {
    question: "Apakah saya bisa melihat riwayat pembelian produk makeup saya?",
    answer: "Ya, riwayat pembelian tersedia di halaman profil pada menu 'Riwayat Transaksi'.",
  },
  {
    question: "Bagaimana cara menghubungi customer service?",
    answer: "Gunakan menu 'Bantuan' atau klik ikon chat di pojok kanan bawah untuk terhubung langsung dengan CS.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-6 bg-white shadow-md rounded-xl">
      <h2 className="text-3xl font-bold text-center mb-6 text-orange-600">Bantuan & FAQ Istana Kosmetik</h2>
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-gray-800 hover:bg-pink-50 transition"
            >
              {item.question}
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-pink-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-gray-700 animate-fadeIn">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
