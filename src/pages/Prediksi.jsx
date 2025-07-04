import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const inputStyle = "p-2 border rounded-lg w-full";
const PIE_COLORS = ['#FB923C', '#C084FC', '#FACC15', '#60A5FA']; // Lipstik, Foundation, Eyeshadow, Highlighter

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
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("https://2737-35-222-144-171.ngrok-free.app/predict", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ success: false, error: 'Gagal memproses prediksi.' });
    }

    setLoading(false);
  };

  const grafikInputUser = [
    { name: 'Usia', value: parseInt(formData.usia || 0) },
    { name: 'Warna Kulit', value: formData.warna_kulit ? 1 : 0 },
    { name: 'Undertone', value: formData.undertone ? 1 : 0 },
    { name: 'Jenis Kulit', value: formData.jenis_kulit ? 1 : 0 },
    { name: 'Gaya Makeup', value: formData.gaya_makeup ? 1 : 0 },
    { name: 'Finish', value: formData.finish ? 1 : 0 }
  ];

  const grafikConfidence = result?.confidence
    ? Object.entries(result.confidence).map(([label, prob]) => ({
        name: label,
        value: Math.round(prob * 100)
      }))
    : [];

  return (
    <div className="flex justify-center py-10 font-sans bg-[#fdfdfc]">
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

          <button type="submit" disabled={loading} className="bg-orange-500 text-white py-2 rounded-xl font-semibold">
            {loading ? 'Memproses...' : 'Rekomendasikan'}
          </button>
        </form>

        {result && (
          <div className="mt-6 bg-gray-50 p-4 rounded-xl space-y-6">
            {result.success ? (
              <>
                <div>
                  <h3 className="text-green-600 text-lg font-bold mb-2">Rekomendasi Makeup untuk Kamu:</h3>
                  <p>💄 <strong>Lipstik:</strong> {result.rekomendasi_produk?.["Lipstik (Brand + Shade)"] || '-'}</p>
                  <p>🧴 <strong>Foundation:</strong> {result.rekomendasi_produk?.["Foundation (Brand + Shade)"] || '-'}</p>
                  <p>🎨 <strong>Eyeshadow:</strong> {result.rekomendasi_produk?.["Eyeshadow (Brand + Shade)"] || '-'}</p>
                  <p>✨ <strong>Highlighter:</strong> {result.rekomendasi_produk?.["Highlighter (Brand + Shade)"] || '-'}</p>
                </div>

                {/* Bar Chart Input */}
                <div>
                  <h4 className="font-semibold text-orange-500 mb-2">📊 Data yang Dimasukkan</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={grafikInputUser} margin={{ top: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-10} textAnchor="end" interval={0} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#FB923C" />
                    </BarChart>
                  </ResponsiveContainer>
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
                        label
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
              <p className="text-red-600">Gagal menghasilkan rekomendasi: {result.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Prediksi;
