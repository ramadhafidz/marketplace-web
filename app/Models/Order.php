<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory; // <-- WAJIB

    protected $table = 'orders';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'roblox_username', 'customer_contact', 'total_harga',
        'status_payment', 'status_order', 'created_at', 'updated_at'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }
}
