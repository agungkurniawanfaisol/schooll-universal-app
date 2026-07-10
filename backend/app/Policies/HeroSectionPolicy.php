<?php

namespace App\Policies;

use App\Models\HeroSection;
use App\Models\User;

class HeroSectionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('content.view');
    }

    public function view(User $user, HeroSection $model): bool
    {
        return $user->can('content.view');
    }

    public function create(User $user): bool
    {
        return $user->can('content.create');
    }

    public function update(User $user, HeroSection $model): bool
    {
        return $user->can('content.update');
    }

    public function delete(User $user, HeroSection $model): bool
    {
        return $user->can('content.delete');
    }
}
