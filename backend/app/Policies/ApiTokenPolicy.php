<?php

namespace App\Policies;

use App\Models\ApiToken;
use App\Models\User;

class ApiTokenPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('api_tokens.view');
    }

    public function view(User $user, ApiToken $model): bool
    {
        return $user->can('api_tokens.view');
    }

    public function create(User $user): bool
    {
        return $user->can('api_tokens.create');
    }

    public function update(User $user, ApiToken $model): bool
    {
        return $user->can('api_tokens.update');
    }

    public function delete(User $user, ApiToken $model): bool
    {
        return $user->can('api_tokens.delete');
    }
}
