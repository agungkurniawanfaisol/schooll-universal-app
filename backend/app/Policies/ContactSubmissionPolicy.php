<?php

namespace App\Policies;

use App\Models\ContactSubmission;
use App\Models\User;

class ContactSubmissionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('contact.view');
    }

    public function view(User $user, ContactSubmission $model): bool
    {
        return $user->can('contact.view');
    }

    public function create(User $user): bool
    {
        return $user->can('contact.create');
    }

    public function update(User $user, ContactSubmission $model): bool
    {
        return $user->can('contact.update');
    }

    public function delete(User $user, ContactSubmission $model): bool
    {
        return $user->can('contact.delete');
    }
}
