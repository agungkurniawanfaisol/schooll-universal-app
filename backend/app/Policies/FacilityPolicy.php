<?php

namespace App\Policies;

use App\Models\Facility;
use App\Models\User;

class FacilityPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('facilitys.view');
    }

    public function view(User $user, Facility $model): bool
    {
        return $user->can('facilitys.view');
    }

    public function create(User $user): bool
    {
        return $user->can('facilitys.create');
    }

    public function update(User $user, Facility $model): bool
    {
        return $user->can('facilitys.update');
    }

    public function delete(User $user, Facility $model): bool
    {
        return $user->can('facilitys.delete');
    }
}
