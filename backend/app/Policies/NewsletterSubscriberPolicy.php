<?php

namespace App\Policies;

use App\Models\NewsletterSubscriber;
use App\Models\User;

class NewsletterSubscriberPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('newsletter.view');
    }

    public function view(User $user, NewsletterSubscriber $model): bool
    {
        return $user->can('newsletter.view');
    }

    public function create(User $user): bool
    {
        return $user->can('newsletter.create');
    }

    public function update(User $user, NewsletterSubscriber $model): bool
    {
        return $user->can('newsletter.update');
    }

    public function delete(User $user, NewsletterSubscriber $model): bool
    {
        return $user->can('newsletter.delete');
    }
}
