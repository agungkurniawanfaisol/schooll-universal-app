<?php

namespace App\Policies;

use App\Models\VisionMission;
use App\Models\User;

class VisionMissionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('content.view');
    }

    public function view(User $user, VisionMission $model): bool
    {
        return $user->can('content.view');
    }

    public function create(User $user): bool
    {
        return $user->can('content.create');
    }

    public function update(User $user, VisionMission $model): bool
    {
        return $user->can('content.update');
    }

    public function delete(User $user, VisionMission $model): bool
    {
        return $user->can('content.delete');
    }
}
