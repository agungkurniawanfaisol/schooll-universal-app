<?php

namespace App\Policies;

use App\Models\WebsiteSetting;
use App\Models\User;

class WebsiteSettingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('settings.view');
    }

    public function view(User $user, WebsiteSetting $model): bool
    {
        return $user->can('settings.view');
    }

    public function create(User $user): bool
    {
        return $user->can('settings.create');
    }

    public function update(User $user, WebsiteSetting $model): bool
    {
        return $user->can('settings.update');
    }

    public function delete(User $user, WebsiteSetting $model): bool
    {
        return $user->can('settings.delete');
    }
}
