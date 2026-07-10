<?php

namespace App\Policies;

use App\Models\NavigationMenu;
use App\Models\User;

class NavigationMenuPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('content.view');
    }

    public function view(User $user, NavigationMenu $model): bool
    {
        return $user->can('content.view');
    }

    public function create(User $user): bool
    {
        return $user->can('content.create');
    }

    public function update(User $user, NavigationMenu $model): bool
    {
        return $user->can('content.update');
    }

    public function delete(User $user, NavigationMenu $model): bool
    {
        return $user->can('content.delete');
    }
}
