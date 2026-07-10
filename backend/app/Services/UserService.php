<?php

namespace App\Services;

use App\DTOs\UserData;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(private UserRepositoryInterface $users) {}

    public function list(array $filters = [], int $perPage = 15)
    {
        return $this->users->paginate($filters, $perPage);
    }

    public function find(int $id): ?User
    {
        return $this->users->find($id);
    }

    public function create(UserData $data, User $actor): User
    {
        $attrs = $data->toArray();
        UserRoleGuard::assertAssignable($attrs['roles'] ?? null, $actor);

        if (! empty($attrs['password'])) {
            $attrs['password'] = Hash::make($attrs['password']);
        }

        $roles = $attrs['roles'] ?? null;
        unset($attrs['roles']);

        $user = $this->users->create($attrs);

        if (! empty($roles)) {
            $user->syncRoles($roles);
        }

        return $user->load('roles');
    }

    public function update(User $user, UserData $data, User $actor): User
    {
        $attrs = $data->toArray();
        UserRoleGuard::assertAssignable($attrs['roles'] ?? null, $actor);

        if (! empty($attrs['password'])) {
            $attrs['password'] = Hash::make($attrs['password']);
        } else {
            unset($attrs['password']);
        }

        $roles = $attrs['roles'] ?? null;
        unset($attrs['roles']);

        $user = $this->users->update($user, $attrs);

        if ($roles !== null) {
            $user->syncRoles($roles);
        }

        return $user->load('roles');
    }

    public function delete(User $user): bool
    {
        return $this->users->delete($user);
    }
}
