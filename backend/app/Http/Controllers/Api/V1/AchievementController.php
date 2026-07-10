<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\AchievementData;
use App\Http\Requests\Api\V1\Achievement\StoreAchievementRequest;
use App\Http\Requests\Api\V1\Achievement\UpdateAchievementRequest;
use App\Http\Resources\AchievementResource;
use App\Models\Achievement;
use App\Services\AchievementService;
use App\Traits\HandlesBulkDelete;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AchievementController extends BaseApiController
{
    use HandlesBulkDelete;

    public function __construct(private AchievementService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Achievement::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(AchievementResource::collection($items));
    }

    public function store(StoreAchievementRequest $request): JsonResponse
    {
        $this->authorize('create', Achievement::class);
        $item = $this->service->create(AchievementData::fromArray($request->validated()));

        return $this->created(new AchievementResource($item));
    }

    public function show(Achievement $achievement): JsonResponse
    {
        $this->authorize('view', $achievement);

        return $this->success(new AchievementResource($achievement));
    }

    public function update(UpdateAchievementRequest $request, Achievement $achievement): JsonResponse
    {
        $this->authorize('update', $achievement);
        $item = $this->service->update($achievement, AchievementData::fromArray($request->validated()));

        return $this->success(new AchievementResource($item), 'Updated successfully');
    }

    public function destroy(Achievement $achievement): JsonResponse
    {
        $this->authorize('delete', $achievement);
        $this->service->delete($achievement);

        return $this->noContent();
    }

    protected function bulkDeleteModelClass(): string
    {
        return Achievement::class;
    }

    protected function bulkDeleteItem(\Illuminate\Database\Eloquent\Model $model): void
    {
        $this->service->delete($model);
    }
}
