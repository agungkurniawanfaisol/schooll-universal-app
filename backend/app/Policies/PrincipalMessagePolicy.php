<?php

namespace App\Policies;

use App\Models\PrincipalMessage;
use App\Models\User;

class PrincipalMessagePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('content.view');
    }

    public function view(User $user, PrincipalMessage $model): bool
    {
        return $user->can('content.view');
    }

    public function create(User $user): bool
    {
        return $user->can('content.create');
    }

    public function update(User $user, PrincipalMessage $model): bool
    {
        return $user->can('content.update');
    }

    public function delete(User $user, PrincipalMessage $model): bool
    {
        return $user->can('content.delete');
    }
}
