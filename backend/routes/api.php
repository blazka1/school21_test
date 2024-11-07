<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CountryController;

Route::get('/countries', [CountryController::class, 'suggestCountries']);
Route::post('/add', [CountryController::class, 'addEntry']);
Route::get('/entries', [CountryController::class, 'getEntries']);

