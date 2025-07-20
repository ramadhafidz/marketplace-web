import React, { useState } from "react";
import { Link } from '@inertiajs/react';

export default function Robux() {
  const [quantity, setQuantity] = useState(50);
  const pricePerUnit = 140; // contoh harga per robux
  const totalPrice = quantity * pricePerUnit;

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
        <h2 className="text-2xl font-bold text-center mb-8">Beli Robux</h2>

        <div className="flex justify-between mb-6">
          <div className="bg-white rounded-md p-4 shadow text-center w-1/2 mr-2">
            <span className="text-lg font-semibold">{quantity}</span>
          </div>
          <div className="bg-white rounded-md p-4 shadow text-center w-1/2 ml-2">
            <span className="text-lg font-semibold">{totalPrice.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <input
          type="range"
          min="1"
          max="500"
          step="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="w-full mb-8"
        />

        <button
          className="w-full py-3 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 transition"
        >
          Beli
        </button>
      </section>
    </div>
  );
}
