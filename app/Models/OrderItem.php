<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderItem extends Model
{
    use HasFactory; // <-- WAJIB

    protected $table = 'order_items';

    protected $fillable = [
        'order_id', 'product_id', 'kuantitas', 'harga_per_item'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
