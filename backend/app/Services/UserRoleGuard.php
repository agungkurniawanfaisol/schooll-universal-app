<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

class UserRoleGuard
{
    private const PROTECTED_ROLES = ['Super Admin'];

    /**
     * @param  list<string>|null  $roles
     */
    public static function assertAssignable(?array $roles, User $actor): void
    {
        if ($roles === null || $roles === []) {
            return;
        }

        $roles = array_values(array_unique($roles));
        $existing = Role::query()->whereIn('name', $roles)->pluck('name')->all();

        if (count($existing) !== count($roles)) {
            throw ValidationException::withMessages([
                'roles' => ['Role yang dipilih tidak valid.'],
            ]);
        }

        if ($actor->hasRole('Super Admin')) {
            return;
        }

        foreach (self::PROTECTED_ROLES as $protected) {
            if (in_array($protected, $roles, true)) {
                throw ValidationException::withMessages([
                    'roles' => ["Anda tidak memiliki izin untuk menetapkan role {$protected}."],
                ]);
            }
        }
    }
}
