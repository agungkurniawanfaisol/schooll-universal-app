<?php

namespace App\Policies;

use App\Models\AcademicEvent;
use App\Models\User;

class AcademicEventPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('academic_events.view');
    }

    public function view(User $user, AcademicEvent $model): bool
    {
        return $user->can('academic_events.view');
    }

    public function create(User $user): bool
    {
        return $user->can('academic_events.create');
    }

    public function update(User $user, AcademicEvent $model): bool
    {
        return $user->can('academic_events.update');
    }

    public function delete(User $user, AcademicEvent $model): bool
    {
        return $user->can('academic_events.delete');
    }
}
