import React from 'react';

// Komponen Card
const Card = ({ children }) => (
  <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-orange-200 hover:shadow-2xl transition-all duration-300">
    {children}
  </div>
);

// Komponen CardContent
const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

// Data Dummy dengan segmentasi waktu
const pesananData = {
  hariIni: [
    {
      idPelanggan: 1,
      namaPelanggan: 'Rina',
      pesanan: [
        { id: 101, namaProduk: 'Lipstik Matte Rose', jumlah: 2, harga: 75000 },
        { id: 102, namaProduk: 'BB Cream Natural Glow', jumlah: 1, harga: 120000 },
      ],
    },
  ],
  mingguIni: [
    {
      idPelanggan: 2,
      namaPelanggan: 'Dewi',
      pesanan: [
        { id: 103, namaProduk: 'Eyeshadow Palette Nude', jumlah: 1, harga: 185000 },
      ],
    },
  ],
  bulanIni: [
    {
      idPelanggan: 3,
      namaPelanggan: 'Lia',
      pesanan: [
        { id: 104, namaProduk: 'Serum Vitamin C', jumlah: 2, harga: 95000 },
        { id: 105, namaProduk: 'Moisturizer Glow', jumlah: 1, harga: 110000 },
      ],
    },
  ],
};

// Komponen Segmen
const Segmen = ({ title, data }) => {
  const hitungSubtotal = (pesanan) =>
    pesanan.reduce((total, item) => total + item.jumlah * item.harga, 0);

  const totalSegment = data.reduce(
    (acc, pelanggan) => acc + hitungSubtotal(pelanggan.pesanan),
    0
  );

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-orange-600 mb-6 border-b pb-2 border-orange-300">
        📅 {title}
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500">Belum ada pesanan di segmen ini.</p>
      ) : (
        <div className="space-y-6">
          {data.map((pelanggan) => (
            <Card key={pelanggan.idPelanggan}>
              <CardContent>
                <h3 className="text-xl font-semibold text-orange-500 mb-4 flex items-center gap-2">
                  👩 {pelanggan.namaPelanggan}
                </h3>

                <div className="space-y-4">
                  {pelanggan.pesanan.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start border-b pb-3 text-gray-700"
                    >
                      <div>
                        <p className="font-medium text-lg">{item.namaProduk}</p>
                        <p className="text-sm text-gray-500">
                          {item.jumlah} x Rp{item.harga.toLocaleString()}
                        </p>
                      </div>
                      <div className="font-semibold text-right text-orange-600 text-lg">
                        Rp{(item.jumlah * item.harga).toLocaleString()}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between pt-5 mt-5 border-t border-orange-100">
                    <span className="font-semibold text-gray-600 text-lg">Subtotal</span>
                    <span className="font-bold text-orange-600 text-xl">
                      Rp{hitungSubtotal(pelanggan.pesanan).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="mt-8 text-right">
            <span className="text-lg font-semibold mr-2 text-gray-700">
              Total Segment:
            </span>
            <span className="text-2xl font-bold text-orange-700">
              Rp{totalSegment.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Komponen Utama
const PemesananKosmetik = () => {
  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-600 mb-12 text-center">
          💄 Pemesanan Kosmetik Pelanggan
        </h1>

        <Segmen title="Hari Ini" data={pesananData.hariIni} />
        <Segmen title="Minggu Ini" data={pesananData.mingguIni} />
        <Segmen title="Bulan Ini" data={pesananData.bulanIni} />
      </div>
    </div>
  );
};

export default PemesananKosmetik;
