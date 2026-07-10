<?php

namespace App\Policies;

use App\Models\PpdbRegistration;
use App\Models\User;

class PpdbRegistrationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('ppdb.view');
    }

    public function view(User $user, PpdbRegistration $model): bool
    {
        return $user->can('ppdb.view');
    }

    public function create(User $user): bool
    {
        return $user->can('ppdb.create');
    }

    public function update(User $user, PpdbRegistration $model): bool
    {
        return $user->can('ppdb.update');
    }

    public function delete(User $user, PpdbRegistration $model): bool
    {
        return $user->can('ppdb.delete');
    }
}
