// src/components/home/Testimoni.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

export default function Testimoni({ withLayout = true }) {
  const [list, setList] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const fetchTestimoni = async () => {
    const { data, error } = await supabase
      .from('testimoni')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setList(data);
  };

  useEffect(() => {
    fetchTestimoni();
  }, []);

  const warnaUtama = '#b4380d';

  const content = (
    <section
      id="testimoni"
      style={{
        backgroundColor: '#fff6ea',
        padding: '60px 20px',
        textAlign: 'center',
      }}
    >
      <h2 style={{ fontSize: 28, color: warnaUtama, marginBottom: 20 }}>
        Testimoni Pelanggan
      </h2>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 24,
          marginBottom: 20,
        }}
      >
        {(showAll ? list : list.slice(0, 4)).map((item, index) => (
          <div
            key={index}
            style={{
              width: 250,
              backgroundColor: 'white',
              borderRadius: 12,
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
              padding: 16,
            }}
          >
            <img
              src={item.foto}
              alt={item.nama}
              style={{
                width: '100%',
                height: 180,
                objectFit: 'cover',
                borderRadius: 10,
                marginBottom: 12,
              }}
            />
            <h4 style={{ color: warnaUtama, fontWeight: 600 }}>{item.nama}</h4>
            <p style={{ fontSize: 14, color: '#333', fontStyle: 'italic' }}>
              {item.ulasan}
            </p>
          </div>
        ))}
      </div>

      <div>
        {!showAll && list.length > 4 && (
          <button
            onClick={() => setShowAll(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: warnaUtama,
              color: '#fff',
              border: 'none',
              borderRadius: 30,
              cursor: 'pointer',
              marginBottom: 20,
              marginRight: 10,
            }}
          >
            Lihat Lainnya
          </button>
        )}

        <button
          onClick={() => navigate('/formtestimoni')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f37021',
            color: '#fff',
            border: 'none',
            borderRadius: 30,
            cursor: 'pointer',
          }}
        >
          Tambah Testimoni
        </button>
      </div>
    </section>
  );

  return withLayout ? (
    <>
      <Navbar activeNav="testimoni" />
      {content}
      <Footer />
    </>
  ) : (
    content
  );
}
