<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        // Produk satuan (yang memiliki stok robux)
        DB::table('products')->insert([
            'tipe_produk' => 'satuan',
            'nama_produk' => 'Robux Satuan',
            'jumlah_robux' => 1,
            'harga' => 70.00, // Harga per robux
            'is_active' => true,
            'stock' => 1000, // Stok total robux
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // Paket-paket robux (tidak menyimpan stok langsung)
        $paket = [
            ['nama' => 'Paket 100 Robux', 'jumlah' => 100, 'harga' => 7000],
            ['nama' => 'Paket 200 Robux', 'jumlah' => 200, 'harga' => 13000],
            ['nama' => 'Paket 500 Robux', 'jumlah' => 500, 'harga' => 30000],
        ];

        foreach ($paket as $p) {
            DB::table('products')->insert([
                'tipe_produk' => 'paket',
                'nama_produk' => $p['nama'],
                'jumlah_robux' => $p['jumlah'],
                'harga' => $p['harga'],
                'is_active' => true,
                'stock' => null, // Paket tidak punya stok sendiri
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }
}
