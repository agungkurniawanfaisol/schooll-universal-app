<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\Auth\LoginData;
use App\Http\Requests\Api\V1\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends BaseApiController
{
    public function __construct(private AuthService $authService) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login(new LoginData(
            email: $request->validated('email'),
            password: $request->validated('password'),
            deviceName: $request->input('device_name', 'api'),
        ));

        return $this->success([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
        ], 'Login berhasil');
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return $this->success(null, 'Logout berhasil');
    }

    public function me(Request $request): JsonResponse
    {
        $user = $this->authService->me($request->user());

        return $this->success(new UserResource($user));
    }

    public function refresh(Request $request): JsonResponse
    {
        $token = $this->authService->refresh($request->user());

        return $this->success(['token' => $token], 'Token diperbarui');
    }
}
