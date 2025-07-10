import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { ChevronDown, ChevronUp, HelpCircle, Search } from "lucide-react";

export default function ListFaqPelanggan() {
  const [faqList, setFaqList] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFaq = async () => {
    const { data, error } = await supabase
      .from("faq")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setFaqList(data);
    else console.error(error);
  };

  useEffect(() => {
    fetchFaq();
  }, []);

  const filteredFaq = faqList.filter((faq) =>
    faq.pertanyaan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* HERO */}
      <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 pb-20 pt-16 text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="flex justify-center mb-4">
            <HelpCircle className="w-12 h-12 text-orange-100 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Pusat Bantuan & FAQ</h1>
          <p className="text-orange-100">
            Temukan jawaban atas pertanyaan umum pelanggan kami 💬
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="url(#gradient2)"
            />
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,165,0,0.3)" />
                <stop offset="100%" stopColor="rgba(255,255,255,1)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* SEARCH */}
      <div className="max-w-3xl mx-auto px-6 mt-8 z-10 relative">
        <div className="bg-white p-5 rounded-3xl shadow-xl border border-orange-200">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50 text-gray-700 placeholder:text-orange-400"
            />
          </div>
        </div>
      </div>

      {/* FAQ LIST */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {filteredFaq.length === 0 ? (
          <p className="text-center text-orange-600 mt-6">Tidak ada pertanyaan ditemukan.</p>
        ) : (
          <div className="space-y-5">
            {filteredFaq.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-orange-100 shadow hover:shadow-md transition"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left"
                >
                  <h3 className="font-medium text-orange-800 text-sm md:text-base">
                    {faq.pertanyaan}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="text-orange-600 w-5 h-5" />
                  ) : (
                    <ChevronDown className="text-orange-600 w-5 h-5" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-4 text-sm text-gray-700 border-t border-orange-100">
                    {faq.jawaban}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
