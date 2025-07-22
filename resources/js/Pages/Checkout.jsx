import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Checkout() {
    const urlParams = new URLSearchParams(window.location.search);
    const initialJumlah = parseInt(urlParams.get("jumlah") || "1");
    const productId = window.location.pathname.split("/").pop();

    const [product, setProduct] = useState(null);
    const [username, setUsername] = useState("");
    const [contact, setContact] = useState("");
    const [message, setMessage] = useState("");
    const [jumlah, setJumlah] = useState(initialJumlah); // <== Ubah ini

  useEffect(() => {
    axios.get(`/api/product/${productId}`)
      .then(res => setProduct(res.data))
      .catch(() => setMessage("Gagal memuat produk"));
  }, []);

  const handleSubmit = () => {
    if (!product) return;

    axios.post('/api/order-checkout', {
      product_id: product.id,
      roblox_username: username,
      customer_contact: contact,
      jumlah: jumlah,
    })
    .then(res => setMessage(res.data.message))
    .catch(err => {
      setMessage(err.response?.data?.message || "Gagal memproses pesanan.");
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Pembayaran Robux</h2>

      {product ? (
        <>
          <p className="mb-4"><strong>Produk:</strong> {product.nama_produk}</p>
          <p className="mb-4"><strong>Harga:</strong> Rp {(product.harga * jumlah).toLocaleString('id-ID')}</p>
        </>
      ) : (
        <p>Memuat produk...</p>
      )}

      <input
        type="text"
        placeholder="Username Roblox"
        className="w-full mb-4 p-2 border rounded"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="No HP / Kontak"
        className="w-full mb-4 p-2 border rounded"
        value={contact}
        onChange={e => setContact(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 transition"
      >
        Bayar
      </button>

      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
}
