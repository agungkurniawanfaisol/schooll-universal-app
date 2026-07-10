<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\AgendaData;
use App\Http\Requests\Api\V1\Agenda\StoreAgendaRequest;
use App\Http\Requests\Api\V1\Agenda\UpdateAgendaRequest;
use App\Http\Resources\AgendaResource;
use App\Models\Agenda;
use App\Services\AgendaService;
use App\Traits\HandlesBulkDelete;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AgendaController extends BaseApiController
{
    use HandlesBulkDelete;

    public function __construct(private AgendaService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Agenda::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        if ($items instanceof \Illuminate\Contracts\Pagination\LengthAwarePaginator) {
            return $this->paginatedResource($items, AgendaResource::class);
        }

        return $this->success(AgendaResource::collection($items));
    }

    public function store(StoreAgendaRequest $request): JsonResponse
    {
        $this->authorize('create', Agenda::class);
        $item = $this->service->create(AgendaData::fromArray($request->validated()));

        return $this->created(new AgendaResource($item));
    }

    public function show(Agenda $agenda): JsonResponse
    {
        $this->authorize('view', $agenda);

        return $this->success(new AgendaResource($agenda));
    }

    public function update(UpdateAgendaRequest $request, Agenda $agenda): JsonResponse
    {
        $this->authorize('update', $agenda);
        $item = $this->service->update($agenda, AgendaData::fromArray($request->validated()));

        return $this->success(new AgendaResource($item), 'Updated successfully');
    }

    public function destroy(Agenda $agenda): JsonResponse
    {
        $this->authorize('delete', $agenda);
        $this->service->delete($agenda);

        return $this->noContent();
    }

    protected function bulkDeleteModelClass(): string
    {
        return Agenda::class;
    }

    protected function bulkDeleteItem(\Illuminate\Database\Eloquent\Model $model): void
    {
        $this->service->delete($model);
    }
}
