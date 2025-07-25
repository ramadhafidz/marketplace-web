<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    public function definition(): array
    {
        $product = Product::inRandomOrder()->first(); // Ambil dari DB

        return [
            'order_id'       => Order::factory(), // Akan diisi otomatis jika tidak diset
            'product_id'     => $product->id,
            'kuantitas'      => $this->faker->numberBetween(1, 5),
            'harga_per_item' => $product->harga,
            'created_at'     => now(),
            'updated_at'     => now(),
        ];
    }
}
