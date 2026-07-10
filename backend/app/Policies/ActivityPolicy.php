<?php

namespace App\Policies;

use App\Models\Activity;
use App\Models\User;

class ActivityPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('activitys.view');
    }

    public function view(User $user, Activity $model): bool
    {
        return $user->can('activitys.view');
    }

    public function create(User $user): bool
    {
        return $user->can('activitys.create');
    }

    public function update(User $user, Activity $model): bool
    {
        return $user->can('activitys.update');
    }

    public function delete(User $user, Activity $model): bool
    {
        return $user->can('activitys.delete');
    }
}
