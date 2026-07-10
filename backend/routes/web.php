<?php

use App\Http\Controllers\SeoPublicController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => config('app.name'),
        'version' => config('version.version'),
        'version_code' => config('version.version_code'),
        'api' => url('/api/v1'),
    ]);
});

Route::get('/robots.txt', [SeoPublicController::class, 'robots']);
Route::get('/sitemap.xml', [SeoPublicController::class, 'sitemap']);
