<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\FacilityData;
use App\Http\Requests\Api\V1\Facility\StoreFacilityRequest;
use App\Http\Requests\Api\V1\Facility\UpdateFacilityRequest;
use App\Http\Resources\FacilityResource;
use App\Models\Facility;
use App\Services\FacilityService;
use App\Traits\HandlesBulkDelete;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FacilityController extends BaseApiController
{
    use HandlesBulkDelete;

    public function __construct(private FacilityService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Facility::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(FacilityResource::collection($items));
    }

    public function store(StoreFacilityRequest $request): JsonResponse
    {
        $this->authorize('create', Facility::class);
        $item = $this->service->create(FacilityData::fromArray($request->validated()));

        return $this->created(new FacilityResource($item));
    }

    public function show(Facility $facility): JsonResponse
    {
        $this->authorize('view', $facility);

        return $this->success(new FacilityResource($facility));
    }

    public function update(UpdateFacilityRequest $request, Facility $facility): JsonResponse
    {
        $this->authorize('update', $facility);
        $item = $this->service->update($facility, FacilityData::fromArray($request->validated()));

        return $this->success(new FacilityResource($item), 'Updated successfully');
    }

    public function destroy(Facility $facility): JsonResponse
    {
        $this->authorize('delete', $facility);
        $this->service->delete($facility);

        return $this->noContent();
    }

    protected function bulkDeleteModelClass(): string
    {
        return Facility::class;
    }

    protected function bulkDeleteItem(\Illuminate\Database\Eloquent\Model $model): void
    {
        $this->service->delete($model);
    }
}
