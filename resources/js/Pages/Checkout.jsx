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
  const [jumlah, setJumlah] = useState(initialJumlah);

  const [robloxUser, setRobloxUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [valid, setValid] = useState(null); // null: belum dicek, true: valid, false: tidak valid
  const [checking, setChecking] = useState(false);

  // Ambil data produk
  useEffect(() => {
    axios.get(`/api/product/${productId}`)
      .then(res => setProduct(res.data))
      .catch(() => setMessage("Gagal memuat produk"));
  }, []);

  // Load script Midtrans Snap
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", process.env.MIDTRANS_CLIENT_KEY);
    document.body.appendChild(script);
  }, []);

  // Cek username Roblox saat berubah
  useEffect(() => {
    if (!username) {
      setRobloxUser(null);
      setAvatar(null);
      setValid(null);
      return;
    }

    const delay = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await axios.post('/roblox-lookup', { username });
        setRobloxUser(res.data);
        setAvatar(res.data.avatar);
        setValid(true);
      } catch (err) {
        setValid(false);
        setRobloxUser(null);
        setAvatar(null);
      } finally {
        setChecking(false);
      }
    }, 800); // debounce delay

    return () => clearTimeout(delay);
  }, [username]);

  const handleSubmit = async () => {
    if (!product || !robloxUser || !valid) {
      setMessage("Pastikan username Roblox valid dan produk tersedia.");
      return;
    }

    try {
      const res = await axios.post("/api/order-checkout", {
        product_id: product.id,
        jumlah,
        roblox_username: robloxUser.name,
        customer_contact: contact,
      });

      setMessage(res.data.message);

      const snapToken = res.data.snap_token;
      if (window.snap && snapToken) {
        window.snap.pay(snapToken, {
          onSuccess: (result) => console.log("✅ Pembayaran berhasil:", result),
          onPending: (result) => console.log("⏳ Pembayaran pending:", result),
          onError: (result) => console.log("❌ Pembayaran error:", result),
          onClose: () => alert("Kamu menutup halaman pembayaran."),
        });
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Gagal memproses pesanan.");
    }
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
        className="w-full mb-2 p-2 border rounded"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      {checking && <p className="text-sm text-gray-500 mb-4">Mengecek username...</p>}

      {username && (
        <div className="flex items-center gap-4 mb-4">
          {avatar && (
            <img
              src={avatar}
              alt="Roblox Avatar"
              className="w-16 h-16 rounded-full border"
            />
          )}
          {valid === true && robloxUser && (
            <p className="text-green-600 font-medium">
              Username Ditemukan: {robloxUser.displayName || robloxUser.name}
            </p>
          )}
          {valid === false && (
            <p className="text-red-600 font-medium">
              Username tidak ditemukan
            </p>
          )}
        </div>
      )}

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
