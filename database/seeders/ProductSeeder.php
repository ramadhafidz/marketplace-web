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
            'stock' => 1000000000000, // Stok total robux
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // Paket-paket robux (tidak menyimpan stok langsung)
        $paket = [
            ['nama' => 'Paket 100 Robux', 'jumlah' => 100, 'harga' => 7000],
            ['nama' => 'Paket 200 Robux', 'jumlah' => 200, 'harga' => 13000],
            ['nama' => 'Paket 500 Robux', 'jumlah' => 500, 'harga' => 30000],
            ['nama' => 'Paket 1000 Robux', 'jumlah' => 1000, 'harga' => 55000],
            ['nama' => 'Paket 2000 Robux', 'jumlah' => 2000, 'harga' => 100000],
            ['nama' => 'Paket 5000 Robux', 'jumlah' => 5000, 'harga' => 200000],
            ['nama' => 'Paket 10000 Robux', 'jumlah' => 10000, 'harga' => 350000],
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
