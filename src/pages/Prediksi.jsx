import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const inputStyle = "p-2 border rounded-lg w-full";
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
    if (parseInt(formData.usia) < 13) {
      alert("❗ Usia minimal 13 tahun.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch( "https://0db3-34-83-163-92.ngrok-free.app/predict", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('❌ Error:', error);
      setResult({ success: false, error: 'Gagal memproses prediksi.' });
    }

    setLoading(false);
  };

  const grafikConfidence = result?.confidence
    ? Object.entries(result.confidence).map(([label, prob]) => ({
        name: label,
        value: Math.round(prob * 100)
      }))
    : [];

  return (
    <div className="flex justify-center py-10 font-sans bg-[#fdfdfc] min-h-screen">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-orange-500 mb-4">Form Rekomendasi Makeup</h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {[
            { label: "Usia", name: "usia", type: "number", placeholder: "Contoh: 25" },
            { label: "Warna Kulit", name: "warna_kulit", options: ["Light", "Medium", "Tan", "Deep"] },
            { label: "Undertone", name: "undertone", options: ["Cool", "Warm", "Neutral"] },
            { label: "Jenis Kulit", name: "jenis_kulit", options: ["Kering", "Berminyak", "Kombinasi", "Sensitif"] },
            { label: "Gaya Makeup", name: "gaya_makeup", options: ["Natural", "Glowing", "Fresh", "Bold Glam", "No-Makeup"] },
            { label: "Finish", name: "finish", options: ["Matte", "Dewy", "Semi-Matte"] }
          ].map((field, index) => (
            <label key={index}>
              <span className="text-sm font-semibold text-gray-700">{field.label}</span>
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
            className="bg-orange-500 text-white py-2 rounded-xl font-semibold hover:bg-orange-600 transition duration-200"
          >
            {loading ? 'Memproses...' : 'Rekomendasikan'}
          </button>
        </form>

        {/* Hasil Rekomendasi */}
        {result && (
          <div className="mt-6 bg-gray-50 p-4 rounded-xl space-y-6 overflow-auto">
            {result.success ? (
              <>
                {/* Rekomendasi Produk */}
                <div>
                  <h3 className="text-green-600 text-lg font-bold mb-2">Rekomendasi Makeup untuk Kamu:</h3>
                  <ul className="space-y-1">
                    <li>💄 <strong>Lipstik:</strong> {result.rekomendasi_produk?.["Lipstik (Brand + Shade)"]}</li>
                    <li>🧴 <strong>Foundation:</strong> {result.rekomendasi_produk?.["Foundation (Brand + Shade)"]}</li>
                    <li>🎨 <strong>Eyeshadow:</strong> {result.rekomendasi_produk?.["Eyeshadow (Brand + Shade)"]}</li>
                    <li>✨ <strong>Highlighter:</strong> {result.rekomendasi_produk?.["Highlighter (Brand + Shade)"]}</li>
                  </ul>
                </div>

                {/* Pie Chart Confidence */}
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2">📈 Confidence Prediksi</h4>
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
              <p className="text-red-600 font-semibold">❗ Gagal: {result.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Prediksi;
