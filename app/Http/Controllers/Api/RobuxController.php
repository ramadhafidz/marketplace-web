<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RobuxController extends Controller
{
    public function getStock()
    {
        $product = Product::where('tipe_produk', 'satuan')->first();

        return response()->json([
            'product_id' => $product?->id ?? null, 
            'stock' => $product?->stock ?? 0,
            'price_per_unit' => $product?->harga ?? 0,
        ]);
    }

    public function getProduct($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Produk tidak ditemukan'], 404);
        }

        return response()->json($product);
    }

    public function purchase(Request $request)
    {
        $request->validate([
            'jumlah' => 'required|integer|min:1',
        ]);

        $product = Product::where('tipe_produk', 'satuan')->first();

        if (!$product || $product->stock < $request->jumlah) {
            return response()->json(['message' => 'Stok tidak cukup'], 400);
        }

        $product->stock -= $request->jumlah;
        $product->save();

        return response()->json(['message' => 'Pembelian berhasil', 'sisa_stock' => $product->stock]);
    }

    public function purchasePaket(Request $request)
    {
        $request->validate([
            'paket_id' => 'required|exists:products,id',
            'jumlah_paket' => 'required|integer|min:1',
        ]);

        $paket = Product::where('id', $request->paket_id)
            ->where('tipe_produk', 'paket')
            ->firstOrFail();

        $productSatuan = Product::where('tipe_produk', 'satuan')->firstOrFail();
        $totalRobux = $paket->jumlah_robux * $request->jumlah_paket;

        if ($productSatuan->stock < $totalRobux) {
            return response()->json(['message' => 'Stok tidak cukup'], 400);
        }

        $productSatuan->stock -= $totalRobux;
        $productSatuan->save();

        return response()->json(['message' => 'Pembelian paket berhasil', 'sisa_stock' => $productSatuan->stock]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'roblox_username' => 'required|string',
            'customer_contact' => 'required|string',
            'jumlah' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);
        $productSatuan = Product::where('tipe_produk', 'satuan')->firstOrFail();

        $jumlahRobux = $product->tipe_produk === 'paket'
            ? $product->jumlah_robux * $request->jumlah
            : $request->jumlah;

        $totalHarga = $product->harga * $request->jumlah;

        if ($productSatuan->stock < $jumlahRobux) {
            return response()->json(['message' => 'Stok tidak cukup'], 400);
        }

        if ($product->tipe_produk === 'paket' && $productSatuan->stock < $jumlahRobux) {
            return response()->json(['message' => 'Stok tidak cukup'], 400);
        }

        if ($product->tipe_produk === 'satuan' && $productSatuan->stock < 1) {
            return response()->json(['message' => 'Stok tidak cukup'], 400);
        }

        $orderId = 'ORD' . strtoupper(Str::random(8));

        $order = Order::create([
            'id' => $orderId,
            'roblox_username' => $request->roblox_username,
            'customer_contact' => $request->customer_contact,
            'total_harga' => $totalHarga,
            'status_payment' => 'pending',
            'status_order' => 'pending',
            'created_at' => now(),
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'kuantitas' => $request->jumlah,
            'harga_per_item' => $product->harga,
        ]);

        $productSatuan->stock -= $jumlahRobux;
        $productSatuan->save();

        return response()->json(['message' => 'Pesanan berhasil dibuat!']);

    }
}
