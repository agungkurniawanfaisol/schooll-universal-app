<?php

namespace App\Policies;

use App\Models\Agenda;
use App\Models\User;

class AgendaPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('agendas.view');
    }

    public function view(User $user, Agenda $model): bool
    {
        return $user->can('agendas.view');
    }

    public function create(User $user): bool
    {
        return $user->can('agendas.create');
    }

    public function update(User $user, Agenda $model): bool
    {
        return $user->can('agendas.update');
    }

    public function delete(User $user, Agenda $model): bool
    {
        return $user->can('agendas.delete');
    }
}
