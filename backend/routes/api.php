<?php

use App\Http\Controllers\Api\StaffIdCardController;
use App\Http\Controllers\Api\StaffInformationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function (): void {
    Route::apiResource('staff', StaffInformationController::class);
    Route::get('staff-id-cards', [StaffIdCardController::class, 'index']);
    Route::post('staff/{staff}/id-card-request', [StaffIdCardController::class, 'request']);
    Route::patch('staff-id-cards/{card}/status', [StaffIdCardController::class, 'updateStatus']);
    Route::post('staff-id-cards/{card}/release', [StaffIdCardController::class, 'release']);
});
