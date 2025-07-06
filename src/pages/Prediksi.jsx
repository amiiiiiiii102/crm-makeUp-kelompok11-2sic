import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const inputStyle = "p-2 border rounded-xl w-full bg-white shadow-inner";
const PIE_COLORS = ['#FB923C', '#C084FC', '#FACC15', '#60A5FA']; // Warna: Lipstik, Foundation, Eyeshadow, Highlighter

const Prediksi = () => {
  const [formData, setFormData] = useState({
    usia: '',
    warna_kulit: '',
    undertone: '',
    jenis_kulit: '',
    gaya_makeup: '',
    finish: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseInt(formData.usia) < 17) {
  alert("❗ Usia minimal 17 tahun.");
  return;
}


    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("https://a294-34-83-159-237.ngrok-free.app/predict", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('❌ Error:', error);
      setResult({ status: 'error', message: 'Gagal memproses prediksi.' });
    }

    setLoading(false);
  };

  const grafikConfidence = result?.status === "success"
    ? Object.entries(result.result).map(([label, data]) => ({
        name: label,
        value: parseFloat(data.confidence.replace('%', ''))
      }))
    : [];

  return (
    <div className="flex justify-center py-10 font-sans bg-[#fdfdfc] min-h-screen px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-orange-500 mb-3 text-center">✨ Rekomendasi Makeup Istimewa ✨</h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Masukkan detail kecantikanmu di bawah ini, dan biarkan sistem kami memberikan produk makeup terbaik sesuai profilmu! 💖
        </p>

        <form onSubmit={handleSubmit} className="grid gap-5">
          {[
            { label: "Usia", name: "usia", type: "number", placeholder: "Contoh: 25" },
            { label: "Warna Kulit", name: "warna_kulit", options: ["Light", "Medium", "Tan", "Deep"] },
            { label: "Undertone", name: "undertone", options: ["Cool", "Warm", "Neutral"] },
            { label: "Jenis Kulit", name: "jenis_kulit", options: ["Kering", "Berminyak", "Kombinasi", "Sensitif"] },
            { label: "Gaya Makeup", name: "gaya_makeup", options: ["Natural", "Glowing", "Fresh", "Bold Glam", "No-Makeup"] },
            { label: "Finish", name: "finish", options: ["Matte", "Dewy", "Semi-Matte"] }
          ].map((field, index) => (
            <label key={index} className="block text-gray-700 text-sm font-medium">
              {field.label}
              {field.options ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className={inputStyle}
                >
                  <option value="">Pilih {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className={inputStyle}
                />
              )}
            </label>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition duration-200"
          >
            {loading ? 'Memproses...' : '💄 Rekomendasikan Sekarang'}
          </button>
        </form>

        {/* Hasil Rekomendasi */}
        {result && (
          <div className="mt-8 bg-[#fef9f5] p-5 rounded-xl space-y-6 shadow-inner">
            {result.status === "success" ? (
              <>
                <div>
                  <h3 className="text-pink-600 text-lg font-bold mb-2">✨ Ini dia pilihan terbaik untuk kamu!</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {Object.entries(result.result).map(([label, data]) => (
                      <li key={label}>
                        <strong>{label}:</strong> {data.produk}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-purple-600 mb-2">📊 Persentase Keyakinan Model</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={grafikConfidence}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={85}
                        label={({ name, value }) => `${name} (${value}%)`}
                      >
                        {grafikConfidence.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <p className="text-red-600 font-semibold">❗ Gagal: {result.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Prediksi;
