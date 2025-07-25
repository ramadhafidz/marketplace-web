<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RobuxController;
use App\Http\Controllers\Api\RobloxProxyController;
use App\Models\Product;

Route::get('/robux-stock', [RobuxController::class, 'getStock']);
Route::post('/robux-purchase', [RobuxController::class, 'purchase']);
Route::post('/robux-purchase-paket', [RobuxController::class, 'purchasePaket']);
Route::post('/order-checkout', [RobuxController::class, 'checkout']);
Route::get('/product/{id}', [RobuxController::class, 'getProduct']);


// Contoh: grup API
Route::middleware('api')->group(function () {
    Route::get('/ping', function () {
        return response()->json(['message' => 'pong']);
    });
});
