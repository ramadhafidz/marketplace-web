<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';
    public $incrementing = false; // karena ID kamu string seperti "ORDxxxx"
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'roblox_username', 'customer_contact', 'total_harga',
        'status_payment', 'status_order', 'created_at'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }
}
