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
        Schema::create('orders', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('roblox_username');
            $table->string('customer_contact');
            $table->decimal('total_harga', 10, 2);
            $table->enum('status_payment', ['pending', 'paid', 'failed', 'expired']);
            $table->enum('status_order', ['pending', 'processing', 'done', 'cancelled']);
            $table->timestamp('created_at')->useCurrent();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
