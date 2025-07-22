import React, { useState, useEffect } from "react";
import { Link, router } from '@inertiajs/react';
import axios from "axios";

export default function RobuxPage() {
  const [quantity, setQuantity] = useState(1);
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [stock, setStock] = useState(0);
  const [message, setMessage] = useState("");
  const [productId, setProductId] = useState(null);


  useEffect(() => {
    axios.get('/api/robux-stock')
      .then(res => {
        const stockValue = parseInt(res.data.stock);
        const priceValue = parseFloat(res.data.price_per_unit);

        setStock(stockValue);
        setPricePerUnit(priceValue);
        setQuantity(1);
        setProductId(res.data.product_id);
      });
  }, []);

  const totalPrice = quantity * pricePerUnit;

  // Fungsi untuk validasi input manual
  const handleManualInput = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 1;
    if (value < 1) value = 1;
    if (value > stock) value = stock;
    setQuantity(value);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="w-10 h-10 bg-gray-300 rounded"></div>
        <div className="flex gap-8 font-semibold text-gray-700">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="border-b-2 border-black">Robux</span>
          <Link href="/History" className="hover:underline">History</Link>
        </div>
      </nav>

      {/* Beli Robux */}
      <section className="px-6 py-10 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Beli Robux</h2>

        <div className="flex justify-between mb-6">
          <div className="bg-white rounded-md p-4 shadow text-center w-1/2 mr-2">
            <span className="text-lg font-semibold">
              <input
                type="number"
                value={quantity}
                onChange={handleManualInput}
                min={1}
                max={stock}
                className="w-full text-center border rounded px-1 py-1"
              /> Robux
            </span>
          </div>
          <div className="bg-white rounded-md p-4 shadow text-center w-1/2 ml-2">
            <span className="text-lg font-semibold">
              Rp {totalPrice.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {stock > 0 ? (
          <input
            type="range"
            min={1}
            max={stock}
            step={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full mb-6"
          />
        ) : (
          <p className="text-center">Stok habis</p>
        )}

        <button
          onClick={() => router.visit(`/payment/${productId}?jumlah=${quantity}`)}
          disabled={!productId || stock === 0}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 transition"
        >
          Beli
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </section>
    </div>
  );
}
