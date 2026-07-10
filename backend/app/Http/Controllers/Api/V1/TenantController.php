<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\TenantData;
use App\Http\Requests\Api\V1\Tenant\StoreTenantRequest;
use App\Http\Requests\Api\V1\Tenant\UpdateTenantRequest;
use App\Http\Resources\TenantResource;
use App\Models\Tenant;
use App\Services\TenantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TenantController extends BaseApiController
{
    public function __construct(private TenantService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Tenant::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(TenantResource::collection($items));
    }

    public function store(StoreTenantRequest $request): JsonResponse
    {
        $this->authorize('create', Tenant::class);
        $item = $this->service->create(TenantData::fromArray($request->validated()));

        return $this->created(new TenantResource($item));
    }

    public function show(Tenant $tenant): JsonResponse
    {
        $this->authorize('view', $tenant);

        return $this->success(new TenantResource($tenant));
    }

    public function update(UpdateTenantRequest $request, Tenant $tenant): JsonResponse
    {
        $this->authorize('update', $tenant);
        $item = $this->service->update($tenant, TenantData::fromArray($request->validated()));

        return $this->success(new TenantResource($item), 'Updated successfully');
    }

    public function destroy(Tenant $tenant): JsonResponse
    {
        $this->authorize('delete', $tenant);
        $this->service->delete($tenant);

        return $this->noContent();
    }
}
