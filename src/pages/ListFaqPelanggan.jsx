import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { ChevronDown, ChevronUp, Edit3 } from 'lucide-react';

function ListFaqPelanggan() {
  const [faqList, setFaqList] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const fetchFaq = async () => {
    const { data, error } = await supabase
      .from('faq')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setFaqList(data);
  };

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    fetchFaq();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow-md rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-orange-700 flex items-center gap-2">
          Pusat Bantuan & FAQ
        </h1>
      </div>

      <div className="space-y-4">
        {faqList.map((faq, index) => (
          <div key={faq.id} className="border rounded-md p-4 shadow-sm">
            <div
              onClick={() => toggle(index)}
              className="flex justify-between items-center cursor-pointer"
            >
              <h2 className="font-medium text-orange-800">{faq.pertanyaan}</h2>
              {openIndex === index ? (
                <ChevronUp className="text-orange-700" />
              ) : (
                <ChevronDown className="text-orange-700" />
              )}
            </div>
            {openIndex === index && (
              <p className="text-sm text-gray-700 mt-2">{faq.jawaban}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListFaqPelanggan;
