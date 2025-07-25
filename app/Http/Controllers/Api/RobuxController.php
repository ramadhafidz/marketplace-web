<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Midtrans\Config;
use Midtrans\Snap;

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

        // Configure Midtrans
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('APP_ENV') === 'production';
        Config::$isSanitized = true;
        Config::$is3ds = true;

        // Prepare transaction data for Midtrans
        $transactionData = [
            'transaction_details' => [
                'order_id' => $order->id,
                'gross_amount' => (int) $totalHarga,
            ],
            'customer_details' => [
                'first_name' => $request->roblox_username,
                'phone' => $request->customer_contact,
            ],
            'item_details' => [
                [
                    'id' => $product->id,
                    'price' => (int) $product->harga,
                    'quantity' => (int) $request->jumlah,
                    'name' => $product->nama_produk ?? "Robux Package",
                    'brand' => 'Marketplace',
                    'category' => $product->tipe_produk,
                ]
            ],
        ];

        try {
            // Get snap token from Midtrans
            $snapToken = Snap::getSnapToken($transactionData);
            
            // Update order with snap token
            $order->update(['snap_token' => $snapToken]);

        } catch (\Exception $e) {
            // If Midtrans fails, delete the order and return error
            $order->delete();
            return response()->json([
                'message' => 'Gagal membuat payment token: ' . $e->getMessage()
            ], 500);
        }

        $productSatuan->stock -= $jumlahRobux;
        $productSatuan->save();

        return response()->json([
            'message' => 'Pesanan berhasil dibuat!',
            'order_id' => $order->id,
            'snap_token' => $snapToken,
            'total_harga' => $totalHarga
        ]);

    }
}
