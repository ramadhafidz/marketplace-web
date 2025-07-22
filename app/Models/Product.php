<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'tipe_produk',
        'nama_produk',
        'jumlah_robux',
        'harga',
        'is_active',
        'stock',
    ];
}
