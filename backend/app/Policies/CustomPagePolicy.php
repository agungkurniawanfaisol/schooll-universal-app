<?php

namespace App\Policies;

use App\Models\CustomPage;
use App\Models\User;

class CustomPagePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('pages.view');
    }

    public function view(User $user, CustomPage $model): bool
    {
        return $user->can('pages.view');
    }

    public function create(User $user): bool
    {
        return $user->can('pages.create');
    }

    public function update(User $user, CustomPage $model): bool
    {
        return $user->can('pages.update');
    }

    public function delete(User $user, CustomPage $model): bool
    {
        return $user->can('pages.delete');
    }
}
