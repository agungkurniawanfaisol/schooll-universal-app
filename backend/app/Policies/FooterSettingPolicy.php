<?php

namespace App\Policies;

use App\Models\FooterSetting;
use App\Models\User;

class FooterSettingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('content.view');
    }

    public function view(User $user, FooterSetting $model): bool
    {
        return $user->can('content.view');
    }

    public function create(User $user): bool
    {
        return $user->can('content.create');
    }

    public function update(User $user, FooterSetting $model): bool
    {
        return $user->can('content.update');
    }

    public function delete(User $user, FooterSetting $model): bool
    {
        return $user->can('content.delete');
    }
}
