<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\CustomPageData;
use App\Http\Requests\Api\V1\CustomPage\StoreCustomPageRequest;
use App\Http\Requests\Api\V1\CustomPage\UpdateCustomPageRequest;
use App\Http\Resources\CustomPageResource;
use App\Models\CustomPage;
use App\Services\CustomPageService;
use App\Traits\HandlesBulkDelete;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomPageController extends BaseApiController
{
    use HandlesBulkDelete;

    public function __construct(private CustomPageService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', CustomPage::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(CustomPageResource::collection($items));
    }

    public function store(StoreCustomPageRequest $request): JsonResponse
    {
        $this->authorize('create', CustomPage::class);
        $item = $this->service->create(CustomPageData::fromArray($request->validated()));

        return $this->created(new CustomPageResource($item));
    }

    public function show(CustomPage $customPage): JsonResponse
    {
        $this->authorize('view', $customPage);

        return $this->success(new CustomPageResource($customPage));
    }

    public function update(UpdateCustomPageRequest $request, CustomPage $customPage): JsonResponse
    {
        $this->authorize('update', $customPage);
        $item = $this->service->update($customPage, CustomPageData::fromArray($request->validated()));

        return $this->success(new CustomPageResource($item), 'Updated successfully');
    }

    public function destroy(CustomPage $customPage): JsonResponse
    {
        $this->authorize('delete', $customPage);
        $this->service->delete($customPage);

        return $this->noContent();
    }

    protected function bulkDeleteModelClass(): string
    {
        return CustomPage::class;
    }

    protected function bulkDeleteItem(Model $model): void
    {
        $this->service->delete($model);
    }
}
