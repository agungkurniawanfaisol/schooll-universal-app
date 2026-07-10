<?php

namespace App\Policies;

use App\Models\DownloadDocument;
use App\Models\User;

class DownloadDocumentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('downloads.view');
    }

    public function view(User $user, DownloadDocument $model): bool
    {
        return $user->can('downloads.view');
    }

    public function create(User $user): bool
    {
        return $user->can('downloads.create');
    }

    public function update(User $user, DownloadDocument $model): bool
    {
        return $user->can('downloads.update');
    }

    public function delete(User $user, DownloadDocument $model): bool
    {
        return $user->can('downloads.delete');
    }
}
