<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Api\V1\Role\StoreRoleRequest;
use App\Http\Requests\Api\V1\Role\UpdateRoleRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RoleController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('roles.view'), 403);

        $roles = Role::query()->with('permissions')->paginate((int) $request->get('per_page', 15));

        return $this->success($roles->items(), meta: [
            'current_page' => $roles->currentPage(),
            'last_page' => $roles->lastPage(),
            'per_page' => $roles->perPage(),
            'total' => $roles->total(),
        ]);
    }

    public function store(StoreRoleRequest $request): JsonResponse
    {
        abort_unless($request->user()->can('roles.create'), 403);

        $role = Role::query()->create([
            'name' => $request->validated('name'),
            'guard_name' => 'web',
        ]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->validated('permissions'));
        }

        return $this->created($role->load('permissions'));
    }

    public function show(Request $request, Role $role): JsonResponse
    {
        abort_unless($request->user()->can('roles.view'), 403);

        return $this->success($role->load('permissions'));
    }

    public function update(UpdateRoleRequest $request, Role $role): JsonResponse
    {
        abort_unless($request->user()->can('roles.update'), 403);

        if ($request->has('name')) {
            $role->update(['name' => $request->validated('name')]);
        }

        if ($request->has('permissions')) {
            $role->syncPermissions($request->validated('permissions'));
        }

        return $this->success($role->load('permissions'), 'Updated successfully');
    }

    public function destroy(Request $request, Role $role): JsonResponse
    {
        abort_unless($request->user()->can('roles.delete'), 403);

        if (in_array($role->name, ['Super Admin', 'Admin', 'Editor'], true)) {
            return $this->error('Role default tidak dapat dihapus', 422);
        }

        $role->delete();

        return $this->noContent();
    }
}
