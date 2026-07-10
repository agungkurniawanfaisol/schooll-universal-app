<?php

namespace App\Policies;

use App\Models\AboutSchool;
use App\Models\User;

class AboutSchoolPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('content.view');
    }

    public function view(User $user, AboutSchool $model): bool
    {
        return $user->can('content.view');
    }

    public function create(User $user): bool
    {
        return $user->can('content.create');
    }

    public function update(User $user, AboutSchool $model): bool
    {
        return $user->can('content.update');
    }

    public function delete(User $user, AboutSchool $model): bool
    {
        return $user->can('content.delete');
    }
}
