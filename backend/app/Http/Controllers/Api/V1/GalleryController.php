<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\GalleryData;
use App\Http\Requests\Api\V1\Gallery\StoreGalleryRequest;
use App\Http\Requests\Api\V1\Gallery\UpdateGalleryRequest;
use App\Http\Resources\GalleryResource;
use App\Models\Gallery;
use App\Services\GalleryService;
use App\Traits\HandlesBulkDelete;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalleryController extends BaseApiController
{
    use HandlesBulkDelete;

    public function __construct(private GalleryService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Gallery::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(GalleryResource::collection($items));
    }

    public function store(StoreGalleryRequest $request): JsonResponse
    {
        $this->authorize('create', Gallery::class);
        $item = $this->service->create(GalleryData::fromArray($request->validated()));

        return $this->created(new GalleryResource($item));
    }

    public function show(Gallery $gallery): JsonResponse
    {
        $this->authorize('view', $gallery);

        return $this->success(new GalleryResource($gallery));
    }

    public function update(UpdateGalleryRequest $request, Gallery $gallery): JsonResponse
    {
        $this->authorize('update', $gallery);
        $item = $this->service->update($gallery, GalleryData::fromArray($request->validated()));

        return $this->success(new GalleryResource($item), 'Updated successfully');
    }

    public function destroy(Gallery $gallery): JsonResponse
    {
        $this->authorize('delete', $gallery);
        $this->service->delete($gallery);

        return $this->noContent();
    }

    protected function bulkDeleteModelClass(): string
    {
        return Gallery::class;
    }

    protected function bulkDeleteItem(\Illuminate\Database\Eloquent\Model $model): void
    {
        $this->service->delete($model);
    }
}
