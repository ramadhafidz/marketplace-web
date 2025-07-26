import React, { useState, useMemo } from "react";
import { Link, router } from "@inertiajs/react";
import axios from "axios";

export default function HomePage({ paket = [] }) {
  const [message, setMessage] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const formatIDR = (n) =>
    `Rp ${Number(n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

  const hasPaket = useMemo(() => paket && paket.length > 0, [paket]);

  const handleBuyPaket = (paketId) => {
    axios
      .post("/api/robux-purchase-paket", {
        paket_id: paketId,
        jumlah_paket: 1,
      })
      .then((res) => {
        setMessage(res.data.message);
        setTimeout(() => setMessage(""), 3000);
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || "Gagal membeli paket");
        setTimeout(() => setMessage(""), 3000);
      });
  };

  const faqs = [
    {
      q: "Bagaimana cara membeli Robux?",
      a: "Pilih paket atau jumlah Robux satuan, isi data yang diminta, lalu lakukan pembayaran.",
    },
    {
      q: "Kapan Robux saya dikirim?",
      a: "Biasanya dalam 1–10 menit setelah pembayaran terkonfirmasi.",
    },
    {
      q: "Metode pembayaran apa saja yang tersedia?",
      a: "Kami mendukung transfer bank, e-wallet, dan akan segera menambahkan Midtrans.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <header className="static top-0 z-20 bg-white/80 backdrop-blur border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gray-200 rounded" />
            <span className="font-semibold text-gray-700">Robux Store</span>
          </div>
          <nav className="hidden md:flex gap-6 font-medium text-sm">
            <span className="text-blue-600 font-semibold border-b-2 border-blue-600">
              Home
            </span>
            <Link href="/Robux" className="hover:text-blue-600 transition-colors">
              Robux
            </Link>
            <Link href="/History" className="hover:text-blue-600 transition-colors">
              History
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Beli Robux Cepat, Aman, & Transparan
            </h1>
            <p className="mt-4 opacity-90 max-w-lg mx-auto md:mx-0">
              Pilih paket atau beli satuan sesuai kebutuhanmu. Stok real-time, proses cepat.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-start justify-center">
              <Link
                href="/Robux"
                className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-md shadow hover:bg-gray-100 transition"
              >
                Beli Robux Satuan
              </Link>
              <a
                href="#quick-pick"
                className="px-6 py-3 bg-blue-500/70 hover:bg-blue-500 rounded-md font-semibold transition"
              >
                Lihat Paket
              </a>
            </div>
          </div>
          <div className="flex-1 w-full md:w-auto">
            <div className="w-full h-64 bg-white/10 rounded-xl backdrop-blur flex items-center justify-center">
              <span className="text-3xl md:text-4xl font-bold opacity-90">
                Hero Image
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Pick */}
      <section id="quick-pick" className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Quick Pick Paket</h2>
          <Link href="/Robux" className="text-blue-600 hover:underline text-sm">
            Beli Robux Satuan →
          </Link>
        </div>

        {!hasPaket ? (
          <div className="text-gray-500 text-sm bg-white border rounded p-6 text-center">
            Paket belum tersedia.
          </div>
        ) : (
          <>
            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paket.map((item) => (
                <PaketCard
                  key={item.id}
                  item={item}
                  onBuy={() => router.visit(`/payment/${item.id}`)}
                  formatIDR={formatIDR}
                />
              ))}
            </div>

            <div className="md:hidden flex gap-4 overflow-x-auto pb-2 snap-x">
              {paket.map((item) => (
                <div key={item.id} className="snap-start flex-shrink-0 w-64">
                  <PaketCard
                    item={item}
                    onBuy={() => router.visit(`/payment/${item.id}`)}
                    formatIDR={formatIDR}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="text-xl font-semibold mb-4">FAQ</h2>
        <div className="bg-white border rounded shadow divide-y">
          {faqs.map((f, idx) => (
            <button
              key={idx}
              className="w-full text-left p-4 focus:outline-none"
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{f.q}</span>
                <span className="text-gray-400">
                  {openFaq === idx ? "−" : "+"}
                </span>
              </div>
              {openFaq === idx && (
                <p className="mt-2 text-sm text-gray-600">{f.a}</p>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Toast Notification */}
      {message && (
        <div className="fixed bottom-6 left-6 bg-white border px-4 py-3 rounded shadow text-sm text-gray-800">
          {message}
        </div>
      )}

      {/* Floating Chat Button */}
      <button className="fixed bottom-6 right-6 bg-white border rounded-full px-4 py-2 shadow-md font-semibold hover:bg-gray-50">
        Chat
      </button>
    </div>
  );
}

function PaketCard({ item, onBuy, formatIDR }) {
  return (
    <div className="h-full bg-white border rounded-lg shadow-sm p-4 flex flex-col">
      <div className="flex items-center justify-between">
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">
          Paket
        </span>
        <span className="text-xs text-gray-400">
          {item.jumlah_robux} RBX
        </span>
      </div>

      <div className="mt-3 mb-4">
        <h3 className="text-sm font-semibold leading-snug">
          {item.nama_produk}
        </h3>
        <p className="text-lg font-bold text-blue-600 mt-1">
          {formatIDR(item.harga)}
        </p>
      </div>

      <div className="mt-auto flex gap-2">
        <button
          onClick={onBuy}
          className="flex-1 text-xs text-white bg-blue-600 px-3 py-2 rounded hover:bg-blue-700 transition"
        >
          Beli
        </button>       
      </div>
    </div>
  );
}
