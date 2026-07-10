<?php

namespace App\Policies;

use App\Models\SeoSetting;
use App\Models\User;

class SeoSettingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('seo.view');
    }

    public function view(User $user, SeoSetting $model): bool
    {
        return $user->can('seo.view');
    }

    public function create(User $user): bool
    {
        return $user->can('seo.create');
    }

    public function update(User $user, SeoSetting $model): bool
    {
        return $user->can('seo.update');
    }

    public function delete(User $user, SeoSetting $model): bool
    {
        return $user->can('seo.delete');
    }
}
