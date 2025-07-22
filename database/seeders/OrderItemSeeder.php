<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class OrderItemSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('order_items')->insert([
            [
                'order_id' => 'ORD9X7N01HB',
                'product_id' => 2,
                'kuantitas' => 1,
                'harga_per_item' => 7000,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'order_id' => 'ORDW0DJAED6',
                'product_id' => 1,
                'kuantitas' => 1,
                'harga_per_item' => 7000,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
