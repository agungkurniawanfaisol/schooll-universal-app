<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('permissions.view'), 403);

        $permissions = Permission::query()
            ->orderBy('name')
            ->get()
            ->groupBy(fn ($p) => explode('.', $p->name)[0]);

        return $this->success($permissions);
    }
}
