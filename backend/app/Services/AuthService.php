<?php

namespace App\Services;

use App\DTOs\Auth\LoginData;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(private UserRepositoryInterface $users) {}

    public function login(LoginData $data): array
    {
        $user = User::query()->where('email', $data->email)->first();

        if (! $user || ! Hash::check($data->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial tidak valid.'],
            ]);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'email' => ['Akun tidak aktif.'],
            ]);
        }

        $token = $user->createToken($data->deviceName ?? 'api')->plainTextToken;

        return ['user' => $user->load('roles', 'permissions'), 'token' => $token];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }

    public function refresh(User $user): string
    {
        $user->currentAccessToken()?->delete();

        return $user->createToken('api')->plainTextToken;
    }

    public function me(User $user): User
    {
        return $user->load('roles', 'permissions');
    }

    /** @param  array<string, mixed>  $data */
    public function updateProfile(User $user, array $data): User
    {
        $attrs = array_filter([
            'name' => $data['name'] ?? null,
            'avatar' => $data['avatar'] ?? null,
            'password' => $data['password'] ?? null,
        ], fn ($value) => $value !== null);

        if (isset($attrs['password'])) {
            $attrs['password'] = Hash::make($attrs['password']);
        }

        $user->update($attrs);

        return $user->fresh(['roles', 'permissions']);
    }
}
