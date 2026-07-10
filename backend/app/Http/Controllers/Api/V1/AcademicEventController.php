<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\AcademicEventData;
use App\Http\Requests\Api\V1\AcademicEvent\StoreAcademicEventRequest;
use App\Http\Requests\Api\V1\AcademicEvent\UpdateAcademicEventRequest;
use App\Http\Resources\AcademicEventResource;
use App\Models\AcademicEvent;
use App\Services\AcademicEventService;
use App\Traits\HandlesBulkDelete;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AcademicEventController extends BaseApiController
{
    use HandlesBulkDelete;

    public function __construct(private AcademicEventService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', AcademicEvent::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(AcademicEventResource::collection($items));
    }

    public function store(StoreAcademicEventRequest $request): JsonResponse
    {
        $this->authorize('create', AcademicEvent::class);
        $item = $this->service->create(AcademicEventData::fromArray($request->validated()));

        return $this->created(new AcademicEventResource($item));
    }

    public function show(AcademicEvent $academicEvent): JsonResponse
    {
        $this->authorize('view', $academicEvent);

        return $this->success(new AcademicEventResource($academicEvent));
    }

    public function update(UpdateAcademicEventRequest $request, AcademicEvent $academicEvent): JsonResponse
    {
        $this->authorize('update', $academicEvent);
        $item = $this->service->update($academicEvent, AcademicEventData::fromArray($request->validated()));

        return $this->success(new AcademicEventResource($item), 'Updated successfully');
    }

    public function destroy(AcademicEvent $academicEvent): JsonResponse
    {
        $this->authorize('delete', $academicEvent);
        $this->service->delete($academicEvent);

        return $this->noContent();
    }

    protected function bulkDeleteModelClass(): string
    {
        return AcademicEvent::class;
    }

    protected function bulkDeleteItem(Model $model): void
    {
        $this->service->delete($model);
    }
}
