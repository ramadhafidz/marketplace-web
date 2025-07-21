<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class RobuxController extends Controller
{
    public function getStock()
    {
        $product = Product::where('tipe_produk', 'satuan')->first();

        return response()->json([
            'stock' => $product?->stock ?? 0,
            'price_per_unit' => $product?->harga ?? 0,
        ]);
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

        // TODO: catat order (nanti bisa dihubungkan ke tabel `orders`)
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

        // TODO: Catat order paket

        return response()->json(['message' => 'Pembelian paket berhasil', 'sisa_stock' => $productSatuan->stock]);
    }
}

