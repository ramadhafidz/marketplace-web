<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'id'              => 'ORD' . strtoupper(Str::random(10)),
            'roblox_username' => $this->faker->userName(),
            'customer_contact'=> $this->faker->phoneNumber(),
            'total_harga'     => 0, // akan dihitung di afterCreating()
            'status_payment'  => $this->faker->randomElement(['pending', 'paid', 'failed', 'expired']),
            'status_order'    => $this->faker->randomElement(['pending', 'processing', 'done', 'cancelled']),
            'created_at'      => $this->faker->dateTimeBetween('-3 months', 'now'),
            'updated_at'      => now(),
        ];
    }

    public function paid()
    {
        return $this->state(function () {
            return [
                'status_payment' => 'paid',
                'status_order'   => 'done',
            ];
        });
    }

    public function configure()
    {
        return $this->afterCreating(function (Order $order) {
            // Ambil produk random dari database (hasil ProductSeeder)
            $itemsCount = rand(1, 3);
            $total = 0;

            for ($i = 0; $i < $itemsCount; $i++) {
                $product = Product::inRandomOrder()->first(); // Ambil dari DB
                $qty = $this->faker->numberBetween(1, 5);

                OrderItem::factory()->create([
                    'order_id'       => $order->id,
                    'product_id'     => $product->id,
                    'kuantitas'      => $qty,
                    'harga_per_item' => $product->harga,
                ]);

                $total += $product->harga * $qty;
            }

            // Update total harga
            $order->update(['total_harga' => $total]);
        });
    }
}
