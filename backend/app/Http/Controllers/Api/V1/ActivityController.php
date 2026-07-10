<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\ActivityData;
use App\Http\Requests\Api\V1\Activity\StoreActivityRequest;
use App\Http\Requests\Api\V1\Activity\UpdateActivityRequest;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use App\Services\ActivityService;
use App\Traits\HandlesBulkDelete;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityController extends BaseApiController
{
    use HandlesBulkDelete;

    public function __construct(private ActivityService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Activity::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(ActivityResource::collection($items));
    }

    public function store(StoreActivityRequest $request): JsonResponse
    {
        $this->authorize('create', Activity::class);
        $item = $this->service->create(ActivityData::fromArray($request->validated()));

        return $this->created(new ActivityResource($item));
    }

    public function show(Activity $activity): JsonResponse
    {
        $this->authorize('view', $activity);

        return $this->success(new ActivityResource($activity));
    }

    public function update(UpdateActivityRequest $request, Activity $activity): JsonResponse
    {
        $this->authorize('update', $activity);
        $item = $this->service->update($activity, ActivityData::fromArray($request->validated()));

        return $this->success(new ActivityResource($item), 'Updated successfully');
    }

    public function destroy(Activity $activity): JsonResponse
    {
        $this->authorize('delete', $activity);
        $this->service->delete($activity);

        return $this->noContent();
    }

    protected function bulkDeleteModelClass(): string
    {
        return Activity::class;
    }

    protected function bulkDeleteItem(\Illuminate\Database\Eloquent\Model $model): void
    {
        $this->service->delete($model);
    }
}
