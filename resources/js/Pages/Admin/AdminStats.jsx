import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function AdminStats() {
  const [kpi, setKpi] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [robuxVsPembelian, setRobuxVsPembelian] = useState([]);
  const [paketSales, setPaketSales] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/stats").then((res) => {
      setKpi(res.data.kpi);
      setMonthly(res.data.monthly);
      setRobuxVsPembelian(res.data.robuxVsPembelian);
      setPaketSales(res.data.paketSales || []);
    });
  }, []);

  if (!kpi) {
    return (
      <div className="p-6 min-h-screen bg-gray-100 flex items-center justify-center text-gray-500">
        Memuat data...
      </div>
    );
  }

  const formatRp = (num) =>
    `Rp ${Number(num || 0).toLocaleString("id-ID")}`;

  // --- LINE: Robux vs Pembelian ---
  const robuxLabels = robuxVsPembelian.map((d) => d.robux_per_item);
  const robuxPembelianData = robuxVsPembelian.map((d) => d.total_pembelian);

  const robuxVsPembelianChart = {
    labels: robuxLabels,
    datasets: [
      {
        label: "Jumlah Pembelian",
        data: robuxPembelianData,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.2,
        fill: true,
      },
    ],
  };

  // --- LINE: Monthly transaksi / income ---
  const monthlyLabels = monthly.map((m) => m.ym);
  const monthlyTransaksiData = monthly.map((m) => m.transaksi);
  const monthlyIncomeData = monthly.map((m) => m.income);

  const monthlyTransaksiChart = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Transaksi / Bulan",
        data: monthlyTransaksiData,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, .15)",
        tension: 0.2,
        fill: true,
      },
    ],
  };

  const monthlyIncomeChart = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Income / Bulan",
        data: monthlyIncomeData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, .15)",
        tension: 0.2,
        fill: true,
      },
    ],
  };

  // --- BAR: Penjualan Paketan ---
  const paketLabels = paketSales.map((p) => p.nama_produk);
  const paketUnits = paketSales.map((p) => p.total_terjual);
  const paketIncome = paketSales.map((p) => p.total_income);

  const paketBarChart = {
    labels: paketLabels,
    datasets: [
      {
        label: "Unit Terjual",
        data: paketUnits,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        yAxisID: "y",
      },
      {
        label: "Total Income",
        data: paketIncome,
        backgroundColor: "rgba(255, 159, 64, 0.7)",
        yAxisID: "y1",
      },
    ],
  };

  const paketBarOptions = {
    responsive: true,
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        ticks: {
          precision: 0,
        },
        title: {
          display: true,
          text: "Unit Terjual",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Income (Rp)",
        },
        ticks: {
          callback: (val) => `Rp ${Number(val).toLocaleString("id-ID")}`,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            if (ctx.dataset.label === "Total Income") {
              return `${ctx.dataset.label}: ${formatRp(ctx.raw)}`;
            }
            return `${ctx.dataset.label}: ${ctx.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Statistik Penjualan</h1>
        <span className="text-sm text-gray-500">
          Terakhir diperbarui: {new Date().toLocaleString("id-ID")}
        </span>
      </header>

      <main className="p-6 space-y-8">
        {/* KPI Cards */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card title="Total Transaksi" value={kpi.totalTransaksi} />
          <Card title="Total Income" value={formatRp(kpi.totalIncome)} />
          <Card title="Avg Transaksi/Bulan" value={kpi.avgTransaksiBulanan} />
          <Card title="Avg Income/Bulan" value={formatRp(kpi.avgIncomeBulanan)} />
          <Card title="Transaksi Hari Ini" value={kpi.todayTransaksi} />
          <Card title="Income Hari Ini" value={formatRp(kpi.todayIncome)} />
          </div>
        </section>

        {/* Robux vs Pembelian */}
        <section className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-semibold mb-4">
            Grafik: Robux per Item vs Jumlah Pembelian
          </h2>
          <Line data={robuxVsPembelianChart} />
        </section>

        {/* Bar Chart Penjualan Paketan */}
        <section className="bg-white shadow p-4 rounded">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Bar Chart: Penjualan Paket (Unit & Income)
            </h2>
          </div>
          {paketSales.length > 0 ? (
            <Bar data={paketBarChart} options={paketBarOptions} />
          ) : (
            <p className="text-sm text-gray-500">Belum ada data penjualan paket.</p>
          )}
        </section>

        {/* Grafik Bulanan */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Tren Bulanan</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow p-4 rounded">
              <h3 className="text-md font-medium mb-2">Transaksi / Bulan</h3>
              <Line data={monthlyTransaksiChart} />
            </div>

            <div className="bg-white shadow p-4 rounded">
              <h3 className="text-md font-medium mb-2">Income / Bulan</h3>
              <Line data={monthlyIncomeChart} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white shadow p-4 rounded">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
