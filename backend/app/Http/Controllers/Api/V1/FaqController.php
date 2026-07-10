<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\FaqData;
use App\Http\Requests\Api\V1\Faq\StoreFaqRequest;
use App\Http\Requests\Api\V1\Faq\UpdateFaqRequest;
use App\Http\Resources\FaqResource;
use App\Models\Faq;
use App\Services\FaqService;
use App\Traits\HandlesBulkDelete;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends BaseApiController
{
    use HandlesBulkDelete;

    public function __construct(private FaqService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Faq::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(FaqResource::collection($items));
    }

    public function store(StoreFaqRequest $request): JsonResponse
    {
        $this->authorize('create', Faq::class);
        $item = $this->service->create(FaqData::fromArray($request->validated()));

        return $this->created(new FaqResource($item));
    }

    public function show(Faq $faq): JsonResponse
    {
        $this->authorize('view', $faq);

        return $this->success(new FaqResource($faq));
    }

    public function update(UpdateFaqRequest $request, Faq $faq): JsonResponse
    {
        $this->authorize('update', $faq);
        $item = $this->service->update($faq, FaqData::fromArray($request->validated()));

        return $this->success(new FaqResource($item), 'Updated successfully');
    }

    public function destroy(Faq $faq): JsonResponse
    {
        $this->authorize('delete', $faq);
        $this->service->delete($faq);

        return $this->noContent();
    }

    protected function bulkDeleteModelClass(): string
    {
        return Faq::class;
    }

    protected function bulkDeleteItem(Model $model): void
    {
        $this->service->delete($model);
    }
}
