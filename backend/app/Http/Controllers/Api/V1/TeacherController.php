<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\TeacherData;
use App\Http\Requests\Api\V1\Teacher\StoreTeacherRequest;
use App\Http\Requests\Api\V1\Teacher\UpdateTeacherRequest;
use App\Http\Resources\TeacherResource;
use App\Models\Teacher;
use App\Services\TeacherService;
use App\Traits\HandlesBulkDelete;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeacherController extends BaseApiController
{
    use HandlesBulkDelete;

    public function __construct(private TeacherService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Teacher::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(TeacherResource::collection($items));
    }

    public function store(StoreTeacherRequest $request): JsonResponse
    {
        $this->authorize('create', Teacher::class);
        $item = $this->service->create(TeacherData::fromArray($request->validated()));

        return $this->created(new TeacherResource($item));
    }

    public function show(Teacher $teacher): JsonResponse
    {
        $this->authorize('view', $teacher);

        return $this->success(new TeacherResource($teacher));
    }

    public function update(UpdateTeacherRequest $request, Teacher $teacher): JsonResponse
    {
        $this->authorize('update', $teacher);
        $item = $this->service->update($teacher, TeacherData::fromArray($request->validated()));

        return $this->success(new TeacherResource($item), 'Updated successfully');
    }

    public function destroy(Teacher $teacher): JsonResponse
    {
        $this->authorize('delete', $teacher);
        $this->service->delete($teacher);

        return $this->noContent();
    }

    protected function bulkDeleteModelClass(): string
    {
        return Teacher::class;
    }

    protected function bulkDeleteItem(\Illuminate\Database\Eloquent\Model $model): void
    {
        $this->service->delete($model);
    }
}
