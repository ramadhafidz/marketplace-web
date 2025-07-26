import React, { useState, useEffect, useMemo } from "react";
import { Link, router } from "@inertiajs/react";
import axios from "axios";

const MIN_QTY = 100;
const STEP = 50;

export default function RobuxPage() {
  const [quantity, setQuantity] = useState(MIN_QTY);
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [stock, setStock] = useState(0);
  const [productId, setProductId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const formatIDR = (n) =>
    `Rp ${Number(n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

  // Hitung batas maksimum slider agar tetap di kelipatan STEP
  const maxAllowed = useMemo(() => {
    if (stock < MIN_QTY) return 0;
    const floored = Math.floor(stock / STEP) * STEP;
    return Math.max(MIN_QTY, floored);
  }, [stock]);

  const snapToStep = (v) => {
    if (isNaN(v)) v = MIN_QTY;
    // minimal
    if (v < MIN_QTY) v = MIN_QTY;
    // maksimal
    if (maxAllowed && v > maxAllowed) v = maxAllowed;
    // snap ke kelipatan STEP
    const snapped = Math.round((v - MIN_QTY) / STEP) * STEP + MIN_QTY;
    return Math.min(Math.max(snapped, MIN_QTY), maxAllowed || MIN_QTY);
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get("/api/robux-stock")
      .then((res) => {
        if (!mounted) return;
        const s = parseInt(res.data.stock ?? 0);
        const p = parseFloat(res.data.price_per_unit ?? 0);
        setStock(s);
        setPricePerUnit(p);
        setProductId(res.data.product_id);
        if (s >= MIN_QTY) {
          setQuantity(MIN_QTY);
        } else {
          setQuantity(0);
        }
        setErr("");
      })
      .catch(() => {
        if (!mounted) return;
        setErr("Gagal memuat data stok.");
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  const totalPrice = useMemo(
    () => quantity * pricePerUnit,
    [quantity, pricePerUnit]
  );

  const onChangeNumber = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = MIN_QTY;
    if (value < MIN_QTY) value = MIN_QTY;
    if (value > stock) value = stock;
    setQuantity(value);
  };

  const stepBtn = (delta) => {
    setQuantity((q) => snapToStep(q + delta * STEP));
  };

  const onSlide = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const canBuy =
    productId &&
    stock >= MIN_QTY &&
    quantity >= MIN_QTY &&
    quantity <= maxAllowed;

  const stockPercent = useMemo(() => {
    if (!stock || !quantity) return 0;
    return Math.min(100, Math.round((quantity / stock) * 100));
  }, [quantity, stock]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gray-200 rounded" />
            <span className="font-semibold text-gray-700">Robux Store</span>
          </div>

          <nav className="flex gap-6 font-medium text-sm">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span className="text-blue-600 font-semibold border-b-2 border-blue-600">
              Robux
            </span>
            <Link
              href="/History"
              className="hover:text-blue-600 transition-colors"
            >
              History
            </Link>
          </nav>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto flex-1 px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Beli Robux</h1>
        <p className="text-center text-gray-500 mb-8">
          Minimal pembelian <b>{MIN_QTY} Robux</b>, kelipatan <b>{STEP}</b>.
        </p>

        {/* Error / Loading */}
        {loading && (
          <div className="animate-pulse space-y-4">
          <div className="h-24 bg-white rounded shadow" />
          <div className="h-52 bg-white rounded shadow" />
          <div className="h-10 bg-white rounded shadow" />
        </div>
        )}

        {!loading && err && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded p-4 mb-6">
            {err}
          </div>
        )}

        {!loading && !err && (
          <>
            {stock < MIN_QTY && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded p-4 mb-6">
                Stok saat ini {stock.toLocaleString("id-ID")} Robux. Minimal
                pembelian {MIN_QTY} Robux, jadi sementara kamu tidak bisa
                membeli.
              </div>
            )}

            {/* Info Card */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <Info label="Harga / 1 Robux" value={formatIDR(pricePerUnit)} />
                <Info label="Stok Tersedia" value={stock.toLocaleString("id-ID")} />
              </div>
            </div>

            {/* Input Control */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <label className="block text-sm text-gray-500 mb-2">
                Jumlah Robux
              </label>

              <div className="flex items-stretch rounded-md overflow-hidden border">
                <button
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => stepBtn(-1)}
                  disabled={quantity <= MIN_QTY || stock < MIN_QTY}
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={onChangeNumber}
                  min={MIN_QTY}
                  step={1}      // ubah ini jadi 1
                  max={stock}
                  className="w-full text-center focus:outline-none py-2"
                  disabled={stock < MIN_QTY}
                />
                <button
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => stepBtn(1)}
                  disabled={quantity >= maxAllowed || stock < MIN_QTY}
                >
                  +
                </button>
              </div>

              {/* Slider */}
              <div className="mt-6">
                {stock >= MIN_QTY ? (
                  <input
                    type="range"
                    min={MIN_QTY}
                    max={maxAllowed}
                    step={STEP}
                    value={quantity}
                    onChange={onSlide}
                    className="w-full accent-blue-600"
                  />
                ) : (
                  <p className="text-center text-sm text-red-500 mt-4">
                    Stok kurang dari {MIN_QTY} Robux
                  </p>
                )}
              </div>

              {/* Stock Progress */}
              {stock >= MIN_QTY && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{MIN_QTY}</span>
                    <span>
                      {quantity.toLocaleString("id-ID")} /{" "}
                      {stock.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-blue-500 rounded"
                      style={{ width: `${stockPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Summary Card + CTA */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">Ringkasan</h3>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-gray-500">Jumlah</span>
                <span className="font-medium">
                  {quantity.toLocaleString("id-ID")} Robux
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Harga / Robux</span>
                <span className="font-medium">{formatIDR(pricePerUnit)}</span>
              </div>
              <hr className="my-3" />
              <div className="flex items-center justify-between text-base font-semibold mb-4">
                <span>Total</span>
                <span>{formatIDR(totalPrice)}</span>
              </div>

              <button
                onClick={() =>
                  canBuy && router.visit(`/payment/${productId}?jumlah=${quantity}`)
                }
                disabled={!canBuy || loading}
                className="w-full px-5 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading
                  ? "Memuat..."
                  : stock < MIN_QTY
                  ? `Stok kurang dari ${MIN_QTY} Robux`
                  : "Beli Sekarang"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="p-3 border rounded-md">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
