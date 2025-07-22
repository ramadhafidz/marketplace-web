<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('orders')->insert([
            [
                'id' => 'ORD9X7N01HB',
                'roblox_username' => 'ismetJamet',
                'customer_contact' => '08123456789',
                'total_harga' => 7000,
                'status_payment' => 'paid',
                'status_order' => 'done',
                'created_at' => Carbon::now(),
            ],
            [
                'id' => 'ORDW0DJAED6',
                'roblox_username' => 'apispipis',
                'customer_contact' => '089146789204',
                'total_harga' => 7000,
                'status_payment' => 'pending',
                'status_order' => 'pending',
                'created_at' => Carbon::now(),
            ],
        ]);
    }
}
