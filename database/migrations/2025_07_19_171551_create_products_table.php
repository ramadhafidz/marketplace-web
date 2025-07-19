<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // database/migrations/xxxx_xx_xx_create_products_table.php
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->enum('tipe_produk', ['paket', 'satuan']);
            $table->string('nama_produk');
            $table->integer('jumlah_robux');
            $table->decimal('harga', 10, 2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
