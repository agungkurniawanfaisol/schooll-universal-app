<?php

namespace App\Policies;

use App\Models\Extracurricular;
use App\Models\User;

class ExtracurricularPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('extracurriculars.view');
    }

    public function view(User $user, Extracurricular $model): bool
    {
        return $user->can('extracurriculars.view');
    }

    public function create(User $user): bool
    {
        return $user->can('extracurriculars.create');
    }

    public function update(User $user, Extracurricular $model): bool
    {
        return $user->can('extracurriculars.update');
    }

    public function delete(User $user, Extracurricular $model): bool
    {
        return $user->can('extracurriculars.delete');
    }
}
