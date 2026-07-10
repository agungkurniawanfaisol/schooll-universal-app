<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\UserData;
use App\Http\Requests\Api\V1\User\StoreUserRequest;
use App\Http\Requests\Api\V1\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use App\Traits\HandlesBulkDelete;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends BaseApiController
{
    use HandlesBulkDelete;

    public function __construct(private UserService $userService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);
        $users = $this->userService->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(UserResource::collection($users));
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $this->authorize('create', User::class);
        $user = $this->userService->create(UserData::fromArray($request->validated()), $request->user());

        return $this->created(new UserResource($user));
    }

    public function show(User $user): JsonResponse
    {
        $this->authorize('view', $user);

        return $this->success(new UserResource($user->load('roles')));
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $this->authorize('update', $user);
        $user = $this->userService->update($user, UserData::fromArray($request->validated()), $request->user());

        return $this->success(new UserResource($user), 'Updated successfully');
    }

    public function destroy(User $user): JsonResponse
    {
        $this->authorize('delete', $user);
        $this->userService->delete($user);

        return $this->noContent();
    }

    protected function bulkDeleteModelClass(): string
    {
        return User::class;
    }

    protected function bulkDeleteItem(\Illuminate\Database\Eloquent\Model $model): void
    {
        $this->userService->delete($model);
    }
}
