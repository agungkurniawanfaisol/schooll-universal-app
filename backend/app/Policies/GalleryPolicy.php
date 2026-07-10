<?php

namespace App\Policies;

use App\Models\Gallery;
use App\Models\User;

class GalleryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('gallerys.view');
    }

    public function view(User $user, Gallery $model): bool
    {
        return $user->can('gallerys.view');
    }

    public function create(User $user): bool
    {
        return $user->can('gallerys.create');
    }

    public function update(User $user, Gallery $model): bool
    {
        return $user->can('gallerys.update');
    }

    public function delete(User $user, Gallery $model): bool
    {
        return $user->can('gallerys.delete');
    }
}
