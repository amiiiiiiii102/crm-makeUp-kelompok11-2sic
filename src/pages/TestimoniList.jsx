import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function TestimoniList() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("testimoni")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      const updatedData = data.map((item) => {
        const { data: imageData } = supabase
          .storage
          .from("testimoni-foto") // nama bucket kamu
          .getPublicUrl(item.foto); // item.foto = nama file di tabel

        return {
          ...item,
          foto: imageData?.publicUrl ?? "", // fallback ke string kosong
        };
      });

      setData(updatedData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{
      padding: "40px 20px",
      backgroundColor: "#fff6ea",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif"
    }}>
      <h2 style={{
        fontSize: 28,
        marginBottom: 30,
        color: "#b4380d",
        textAlign: "center",
        fontWeight: "bold"
      }}>
        Daftar Testimoni Pelanggan
      </h2>

      <div style={{
        overflowX: "auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        padding: 20
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left"
        }}>
          <thead>
            <tr style={{ backgroundColor: "#fce9dd", color: "#b4380d" }}>
              <th style={thStyle}>No</th>
              <th style={thStyle}>Foto</th>
              <th style={thStyle}>Nama</th>
              <th style={thStyle}>Ulasan</th>
              <th style={thStyle}>Waktu</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.id} style={{
                borderBottom: "1px solid #f0d9cc",
                backgroundColor: i % 2 === 0 ? "#fffdfb" : "#fdf3eb"
              }}>
                <td style={tdStyle}>{i + 1}</td>
                <td style={tdStyle}>
                  <img
                    src={row.foto}
                    alt={row.nama}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      objectFit: "cover",
                      boxShadow: "0 0 6px rgba(0,0,0,0.1)"
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/50?text=No+Image";
                    }}
                  />
                </td>
                <td style={tdStyle}>{row.nama}</td>
                <td style={{ ...tdStyle, fontStyle: "italic" }}>{row.ulasan}</td>
                <td style={tdStyle}>
                  {new Date(row.created_at).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "12px 16px",
  borderBottom: "2px solid #f0d9cc",
  fontSize: 14
};

const tdStyle = {
  padding: "12px 16px",
  fontSize: 14,
  verticalAlign: "top"
};
