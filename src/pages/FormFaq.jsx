import React, { useState, useEffect } from 'react';

const FormFaq = ({ addUser, updateUser, editingUser }) => {
  const [form, setForm] = useState({ pertanyaan: '', jawaban: '' });

  useEffect(() => {
    if (editingUser) {
      setForm(editingUser);
    } else {
      setForm({ pertanyaan: '', jawaban: '' });
    }
  }, [editingUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.pertanyaan || !form.jawaban) return;

    if (editingUser) {
      updateUser(form);
    } else {
      addUser(form);
    }

    setForm({ pertanyaan: '', jawaban: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Pertanyaan"
        className="w-full p-2 border rounded"
        value={form.pertanyaan}
        onChange={(e) => setForm({ ...form, pertanyaan: e.target.value })}
      />
      <input
        type="text"
        placeholder="Jawaban"
        className="w-full p-2 border rounded"
        value={form.jawaban}
        onChange={(e) => setForm({ ...form, jawaban: e.target.value })}
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        {editingUser ? 'Perbarui' : 'Tambah'}
      </button>
    </form>
  );
};

export default FormFaq;