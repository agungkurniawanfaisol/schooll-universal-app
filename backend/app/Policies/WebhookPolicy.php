<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Webhook;

class WebhookPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('webhooks.view');
    }

    public function view(User $user, Webhook $model): bool
    {
        return $user->can('webhooks.view');
    }

    public function create(User $user): bool
    {
        return $user->can('webhooks.create');
    }

    public function update(User $user, Webhook $model): bool
    {
        return $user->can('webhooks.update');
    }

    public function delete(User $user, Webhook $model): bool
    {
        return $user->can('webhooks.delete');
    }
}
