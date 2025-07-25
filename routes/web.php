<?php

use App\Http\Controllers\ProfileController;
use App\Models\Product;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

Route::get('/', function () {
    $paket = Product::where('tipe_produk', 'paket')->get(['id', 'nama_produk', 'jumlah_robux', 'harga']);
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'paket' => $paket,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/Robux', function () {
    return Inertia::render('Robux');
});

Route::get('/payment/{product_id}', function ($product_id) {
    $product = \App\Models\Product::findOrFail($product_id);
    return Inertia::render('Checkout', ['product' => $product]);
    
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



Route::post('/roblox-lookup', function (Request $request) {
  $username = $request->input('username');

  // Validasi
  if (!$username) {
    return response()->json(['error' => 'Username required'], 422);
  }

  // Kirim request ke API Roblox
  $response = Http::post('https://users.roblox.com/v1/usernames/users', [
    'usernames' => [$username],
    'excludeBannedUsers' => false,
  ]);

  $data = $response->json()['data'][0] ?? null;

  if (!$data) {
    return response()->json(['error' => 'User not found'], 404);
  }

  // Ambil avatar thumbnail
  $avatar = Http::get('https://thumbnails.roblox.com/v1/users/avatar-headshot', [
    'userIds' => $data['id'],
    'size' => '150x150',
    'format' => 'Png',
    'isCircular' => 'false',
  ]);

  $imageUrl = $avatar->json()['data'][0]['imageUrl'] ?? null;

  return [
    'name' => $data['name'],
    'displayName' => $data['displayName'],
    'userId' => $data['id'],
    'avatar' => $imageUrl,
  ];

  // 
});


require __DIR__.'/auth.php';
