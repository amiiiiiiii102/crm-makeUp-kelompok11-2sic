import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Kontak({ withLayout = true }) {
  const warnaUtama = "#b4380d";

  const content = (
    <section
      id="kontak"
      style={{
        padding: "60px 20px",
        backgroundColor: "#FFB347",
        textAlign: "center",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          fontSize: 28,
          color: "#fff",
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Hubungi Kami
      </h2>
      <p style={{ marginBottom: 30, color: "#fff", fontWeight: "bold" }}>
        Temukan lokasi, kirim pesan, atau hubungi kami via media sosial
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 30,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Peta kecil */}
        <div style={{ flex: "1 1 300px", minWidth: 300 }}>
          <iframe
            title="Lokasi Istana Cosmetic"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.730967014861!2d101.42374971475325!3d0.5303444637903401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5aab9ab1a3b0d%3A0x6b54ec2e6f2aab5b!2sJl.%20Delima%2C%20Pekanbaru%2C%20Riau!5e0!3m2!1sid!2sid!4v1719143123456"
            width="100%"
            height="240"
            style={{ border: 0, borderRadius: 10 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Form dan Sosial Media */}
        <div
          style={{
            flex: "1 1 500px",
            minWidth: 300,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 20,
            justifyContent: "space-between",
          }}
        >
          {/* Form dalam card */}
          <div
            style={{
              flex: "1 1 280px",
              backgroundColor: "#fff",
              borderRadius: 16,
              boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
              padding: 20,
              textAlign: "left",
            }}
          >
            <h3
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: warnaUtama,
                marginBottom: 12,
              }}
            >
              Kirim Pesan
            </h3>

            <form>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 14, color: "#333" }}>
                  Nama
                  <input
                    type="text"
                    placeholder="Nama Anda"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid #ccc",
                      marginTop: 4,
                    }}
                  />
                </label>
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 14, color: "#333" }}>
                  Email
                  <input
                    type="email"
                    placeholder="Email Anda"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid #ccc",
                      marginTop: 4,
                    }}
                  />
                </label>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 14, color: "#333" }}>
                  Pesan
                  <textarea
                    rows="4"
                    placeholder="Tulis pesan Anda..."
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid #ccc",
                      marginTop: 4,
                    }}
                  ></textarea>
                </label>
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: warnaUtama,
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: 30,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Kirim
              </button>
            </form>
          </div>

          {/* Media sosial */}
          <div
            style={{
              flex: "1 1 140px",
              textAlign: "center",
              alignSelf: "center",
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#fff",
                marginBottom: 10,
              }}
            >
              Sosial Media
            </h3>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp"
              style={{ display: "inline-block", marginBottom: 10 }}
            >
              <img
                src="/images/wa.png"
                alt="WhatsApp"
                style={{ width: 40 }}
              />
            </a>
            <br />
            <a
              href="https://instagram.com/istanacosmetic"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
            >
              <img
                src="/images/ig.png"
                alt="Instagram"
                style={{ width: 40 }}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );

  return withLayout ? (
    <>
      <Navbar activeNav="kontak" />
      {content}
      <Footer />
    </>
  ) : content;
}
