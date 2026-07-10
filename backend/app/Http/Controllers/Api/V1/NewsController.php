<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\NewsData;
use App\Http\Requests\Api\V1\News\StoreNewsRequest;
use App\Http\Requests\Api\V1\News\UpdateNewsRequest;
use App\Http\Resources\NewsResource;
use App\Models\News;
use App\Services\NewsService;
use App\Traits\HandlesBulkDelete;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsController extends BaseApiController
{
    use HandlesBulkDelete;

    public function __construct(private NewsService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', News::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        if ($items instanceof \Illuminate\Contracts\Pagination\LengthAwarePaginator) {
            return $this->paginatedResource($items, NewsResource::class);
        }

        return $this->success(NewsResource::collection($items));
    }

    public function store(StoreNewsRequest $request): JsonResponse
    {
        $this->authorize('create', News::class);
        $item = $this->service->create(NewsData::fromArray($request->validated()));

        return $this->created(new NewsResource($item));
    }

    public function show(News $news): JsonResponse
    {
        $this->authorize('view', $news);

        return $this->success(new NewsResource($news));
    }

    public function update(UpdateNewsRequest $request, News $news): JsonResponse
    {
        $this->authorize('update', $news);
        $item = $this->service->update($news, NewsData::fromArray($request->validated()));

        return $this->success(new NewsResource($item), 'Updated successfully');
    }

    public function destroy(News $news): JsonResponse
    {
        $this->authorize('delete', $news);
        $this->service->delete($news);

        return $this->noContent();
    }

    protected function bulkDeleteModelClass(): string
    {
        return News::class;
    }

    protected function bulkDeleteItem(\Illuminate\Database\Eloquent\Model $model): void
    {
        $this->service->delete($model);
    }
}
