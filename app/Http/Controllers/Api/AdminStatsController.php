<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminStatsController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        // --- KPI Utama ---
        $totalTransaksi = Order::where('status_payment', 'paid')->count();
        $totalIncome    = (float) Order::where('status_payment', 'paid')->sum('total_harga');

        $months = Order::where('status_payment', 'paid')
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as ym')
            ->distinct()
            ->count();

        $avgTransaksiBulanan = $months > 0 ? round($totalTransaksi / $months, 2) : 0;
        $avgIncomeBulanan    = $months > 0 ? round($totalIncome / $months, 2) : 0;

        $todayTransaksi = Order::where('status_payment', 'paid')
            ->whereDate('created_at', $today)
            ->count();

        $todayIncome = (float) Order::where('status_payment', 'paid')
            ->whereDate('created_at', $today)
            ->sum('total_harga');

        // --- Time series bulanan ---
        $monthly = Order::where('status_payment', 'paid')
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as ym, COUNT(*) as transaksi, SUM(total_harga) as income')
            ->groupBy('ym')
            ->orderBy('ym', 'asc')
            ->get();

        // --- Grafik garis: x = jumlah robux per item, y = total pembelian (kuantitas) ---
        $robuxVsPembelian = OrderItem::join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status_payment', 'paid')
            ->selectRaw('
                CASE 
                    WHEN products.tipe_produk = "paket" THEN products.jumlah_robux
                    ELSE 1
                END as robux_per_item,
                SUM(order_items.kuantitas) as total_pembelian
            ')
            ->groupBy('robux_per_item')
            ->orderBy('robux_per_item', 'asc')
            ->get();

        // --- BAR CHART: Penjualan Paketan (total unit & income per paket) ---
        $paketSales = OrderItem::join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('products.tipe_produk', 'paket')
            ->where('orders.status_payment', 'paid')
            ->selectRaw('
                products.id,
                products.nama_produk,
                products.jumlah_robux,
                SUM(order_items.kuantitas) as total_terjual,
                SUM(order_items.kuantitas * order_items.harga_per_item) as total_income
            ')
            ->groupBy('products.id', 'products.nama_produk', 'products.jumlah_robux')
            ->orderBy('products.jumlah_robux', 'asc')
            ->get();

        return response()->json([
            'kpi' => [
                'totalTransaksi'       => $totalTransaksi,
                'totalIncome'          => $totalIncome,
                'avgTransaksiBulanan'  => $avgTransaksiBulanan,
                'avgIncomeBulanan'     => $avgIncomeBulanan,
                'todayTransaksi'       => $todayTransaksi,
                'todayIncome'          => $todayIncome,
            ],
            'monthly'            => $monthly,
            'robuxVsPembelian'   => $robuxVsPembelian,
            'paketSales'         => $paketSales,   // <-- untuk bar chart
        ]);
    }
}
