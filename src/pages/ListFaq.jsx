import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import FormFaq from './FormFaq';
import { ChevronDown, ChevronUp, PlusCircle, Trash2, Edit3 } from 'lucide-react';

function ListFaq() {
  const [faqList, setFaqList] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchFaq = async () => {
    const { data, error } = await supabase
      .from('faq')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setFaqList(data);
  };

  const addUser = async (faq) => {
    const { error } = await supabase.from('faq').insert(faq);
    if (error) console.error(error);
    else {
      fetchFaq();
      setShowForm(false);
    }
  };

  const updateUser = async (faq) => {
    const { error } = await supabase.from('faq').update(faq).eq('id', faq.id);
    if (error) console.error(error);
    else {
      fetchFaq();
      setEditingUser(null);
      setShowForm(false);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus pertanyaan ini?");
    if (!confirmDelete) return;

    const { error } = await supabase.from('faq').delete().eq('id', id);
    if (error) console.error(error);
    else fetchFaq();
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
          <PlusCircle className="text-orange-600" /> Pusat Bantuan & FAQ
        </h1>
        <button
          onClick={() => (showForm ? setShowForm(false) : setShowForm(true))}
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
        <FormFaq
          addUser={addUser}
          updateUser={updateUser}
          editingUser={editingUser}
        />
      )}

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
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => {
                  setEditingUser(faq);
                  setShowForm(true);
                }}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <Edit3 size={16} /> Edit
              </button>
              <button
                onClick={() => deleteUser(faq.id)}
                className="text-sm text-red-600 hover:underline flex items-center gap-1"
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

export default ListFaq;