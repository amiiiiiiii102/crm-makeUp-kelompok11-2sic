import { useEffect, useState } from 'react';
import { supabase } from "../../supabase";
import Navbar from './Navbar';
import Footer from './Footer';

export default function Artikel({ withLayout = true }) {
  const warnaUtama = '#b4380d';
  const [artikel, setArtikel] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedArtikel, setSelectedArtikel] = useState(null);

  useEffect(() => {
    const fetchArtikel = async () => {
      const { data, error } = await supabase
        .from('artikel')
        .select('id, judulartikel, thumbnailartikel, isiartikel')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Gagal ambil artikel:', error);
      } else {
        setArtikel(data);
      }
    };

    fetchArtikel();
  }, []);

  const artikelToShow = showAll ? artikel : artikel.slice(0, 4);

  const renderIsiArtikel = (text) => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    const elements = [];
    let currentList = [];

    lines.forEach((line, index) => {
      const isPoint = /^(\d+\. |- )/.test(line.trim());

      if (isPoint) {
        currentList.push(
          <li key={`li-${index}`} style={{ marginBottom: 8 }}>
            {line.trim()}
          </li>
        );
      } else {
        if (currentList.length) {
          elements.push(
            <ul key={`ul-${index}`} style={{ paddingLeft: 20, marginBottom: 12 }}>
              {currentList}
            </ul>
          );
          currentList = [];
        }
        elements.push(
          <p key={`p-${index}`} style={{ marginBottom: 12 }}>
            {line.trim()}
          </p>
        );
      }
    });

    if (currentList.length) {
      elements.push(
        <ul key="last-ul" style={{ paddingLeft: 20, marginBottom: 12 }}>
          {currentList}
        </ul>
      );
    }

    return elements;
  };

  const content = (
    <section
      id="artikel"
      style={{
        backgroundColor: '#FFB347',
        padding: '40px 20px',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      <h2 style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
        Artikel Terbaru
      </h2>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 30,
        }}
      >
        {artikelToShow.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedArtikel(item)}
            style={{
              backgroundColor: '#fff',
              color: '#333',
              borderRadius: 20,
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              width: 280,
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                backgroundColor: '#f9f9f9',
                padding: 10,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <div
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  overflow: 'hidden',
                  height: 230,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={item.thumbnailartikel}
                  alt={item.judulartikel}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            </div>

            <div style={{ padding: '12px 16px' }}>
              <h3 style={{ fontSize: 16, fontWeight: 'bold', color: warnaUtama, marginBottom: 8 }}>
                {item.judulartikel}
              </h3>
              <p style={{ fontSize: 13, color: '#555' }}>
                {item.isiartikel.substring(0, 60)}...
                <span style={{ fontWeight: 'bold', color: warnaUtama }}> Baca selengkapnya</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {artikel.length > 4 && (
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              padding: '10px 24px',
              backgroundColor: warnaUtama,
              color: 'white',
              border: 'none',
              borderRadius: 30,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {showAll ? 'Sembunyikan' : 'Lihat Artikel Lainnya'}
          </button>
        </div>
      )}

      {selectedArtikel && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: 20,
          }}
          onClick={() => setSelectedArtikel(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 24,
              maxWidth: 500,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <h2 style={{ color: warnaUtama, marginBottom: 12 }}>{selectedArtikel.judulartikel}</h2>
            <img
              src={selectedArtikel.thumbnailartikel}
              alt={selectedArtikel.judulartikel}
              style={{
                width: '100%',
                height: 300,
                objectFit: 'contain',
                marginBottom: 16,
              }}
            />
            <div style={{ color: '#333', lineHeight: 1.6 }}>
              {renderIsiArtikel(selectedArtikel.isiartikel)}
            </div>
            <button
              onClick={() => setSelectedArtikel(null)}
              style={{
                marginTop: 20,
                padding: '8px 20px',
                backgroundColor: warnaUtama,
                color: '#fff',
                border: 'none',
                borderRadius: 20,
                cursor: 'pointer',
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </section>
  );

  return withLayout ? (
    <>
      <Navbar activeNav="artikel" />
      {content}
      <Footer />
    </>
  ) : content;
}
