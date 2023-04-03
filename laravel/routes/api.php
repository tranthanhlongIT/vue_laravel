<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/storage/app/images/{filename}', [ProductController::class, 'getImage']);

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/users/preparedata', [UserController::class, 'prepareData']);
    Route::post('/users/{user:id}', [UserController::class, 'disable']);
    Route::apiResource('/users', UserController::class);
});

Route::middleware('auth:api')->group(function () {
    Route::get('/categories/getall', [CategoryController::class, 'getAll']);
    Route::get('/products/create', [ProductController::class, 'create']);
    Route::apiResource('/products', ProductController::class);
    Route::apiResource('/categories', CategoryController::class);
    Route::get('/products/edit/{int:id}', [ProductController::class, 'edit']);
    Route::post('/products/copy/{product:ProductID}', [ProductController::class, 'copy']);
});
