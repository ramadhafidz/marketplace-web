import React from "react";
import { Link } from '@inertiajs/react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="w-10 h-10 bg-gray-300 rounded"></div>
        <div className="flex gap-8 font-semibold text-gray-700">
          <span className="border-b-2 border-black">Home</span>
          <Link href="/Robux" className="hover:underline">Robux</Link>
          <Link href="/History" className="hover:underline">History</Link>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="w-full h-64 bg-gray-300 flex items-center justify-center text-4xl font-bold text-gray-600">
        Hero Image
      </div>

      {/* Quick Pick */}
      <section className="px-6 py-6">
        <h2 className="text-lg font-semibold mb-4">Quick Pick</h2>
        <div className="flex gap-4 overflow-x-auto">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="w-32 flex-shrink-0 border rounded-lg p-2 flex flex-col items-center justify-center bg-white shadow-sm"
            >
              <div className="w-10 h-10 bg-gray-300 rounded mb-2"></div>
              <span className="text-sm font-medium">100 RBx</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-24">
        <h2 className="text-lg font-semibold mb-2">FAQ</h2>
        <div className="w-full h-32 bg-white rounded shadow-md p-4 text-gray-600">
          {/* Konten FAQ akan ditambahkan di sini */}
        </div>
      </section>

      {/* Chat Button */}
      <button className="fixed bottom-4 right-4 bg-white border rounded-full px-4 py-2 shadow-md font-semibold">
        Chat
      </button>
    </div>
  );
}
