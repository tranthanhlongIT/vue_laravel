<?php

use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Product;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/hihihi', function() {
    return User::create([
        'email' => 'long@gmail.com',
        'name' => 'Long',
        'password' => bcrypt('123456')
    ]);
});

Route::get('/test', function() {
    //return Product::find(1);
    $products = Product::whereIn('ProductID', [1, 2])->orderBy('ProductID');
    return $products->get('ProductID');
});
