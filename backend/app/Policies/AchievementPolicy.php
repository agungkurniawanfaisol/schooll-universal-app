<?php

namespace App\Policies;

use App\Models\Achievement;
use App\Models\User;

class AchievementPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('achievements.view');
    }

    public function view(User $user, Achievement $model): bool
    {
        return $user->can('achievements.view');
    }

    public function create(User $user): bool
    {
        return $user->can('achievements.create');
    }

    public function update(User $user, Achievement $model): bool
    {
        return $user->can('achievements.update');
    }

    public function delete(User $user, Achievement $model): bool
    {
        return $user->can('achievements.delete');
    }
}
