<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\ExtracurricularData;
use App\Http\Requests\Api\V1\Extracurricular\StoreExtracurricularRequest;
use App\Http\Requests\Api\V1\Extracurricular\UpdateExtracurricularRequest;
use App\Http\Resources\ExtracurricularResource;
use App\Models\Extracurricular;
use App\Services\ExtracurricularService;
use App\Traits\HandlesBulkDelete;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExtracurricularController extends BaseApiController
{
    use HandlesBulkDelete;

    public function __construct(private ExtracurricularService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Extracurricular::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(ExtracurricularResource::collection($items));
    }

    public function store(StoreExtracurricularRequest $request): JsonResponse
    {
        $this->authorize('create', Extracurricular::class);
        $item = $this->service->create(ExtracurricularData::fromArray($request->validated()));

        return $this->created(new ExtracurricularResource($item));
    }

    public function show(Extracurricular $extracurricular): JsonResponse
    {
        $this->authorize('view', $extracurricular);

        return $this->success(new ExtracurricularResource($extracurricular));
    }

    public function update(UpdateExtracurricularRequest $request, Extracurricular $extracurricular): JsonResponse
    {
        $this->authorize('update', $extracurricular);
        $item = $this->service->update($extracurricular, ExtracurricularData::fromArray($request->validated()));

        return $this->success(new ExtracurricularResource($item), 'Updated successfully');
    }

    public function destroy(Extracurricular $extracurricular): JsonResponse
    {
        $this->authorize('delete', $extracurricular);
        $this->service->delete($extracurricular);

        return $this->noContent();
    }

    protected function bulkDeleteModelClass(): string
    {
        return Extracurricular::class;
    }

    protected function bulkDeleteItem(Model $model): void
    {
        $this->service->delete($model);
    }
}
