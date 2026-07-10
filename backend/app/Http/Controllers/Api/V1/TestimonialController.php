<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\TestimonialData;
use App\Http\Requests\Api\V1\Testimonial\StoreTestimonialRequest;
use App\Http\Requests\Api\V1\Testimonial\UpdateTestimonialRequest;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use App\Services\TestimonialService;
use App\Traits\HandlesBulkDelete;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends BaseApiController
{
    use HandlesBulkDelete;

    public function __construct(private TestimonialService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Testimonial::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(TestimonialResource::collection($items));
    }

    public function store(StoreTestimonialRequest $request): JsonResponse
    {
        $this->authorize('create', Testimonial::class);
        $item = $this->service->create(TestimonialData::fromArray($request->validated()));

        return $this->created(new TestimonialResource($item));
    }

    public function show(Testimonial $testimonial): JsonResponse
    {
        $this->authorize('view', $testimonial);

        return $this->success(new TestimonialResource($testimonial));
    }

    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial): JsonResponse
    {
        $this->authorize('update', $testimonial);
        $item = $this->service->update($testimonial, TestimonialData::fromArray($request->validated()));

        return $this->success(new TestimonialResource($item), 'Updated successfully');
    }

    public function destroy(Testimonial $testimonial): JsonResponse
    {
        $this->authorize('delete', $testimonial);
        $this->service->delete($testimonial);

        return $this->noContent();
    }

    public function submitPublic(\App\Http\Requests\Api\V1\Testimonial\SubmitTestimonialRequest $request): JsonResponse
    {
        $item = $this->service->submitPublic($request->validated());

        return $this->created(new TestimonialResource($item), 'Testimoni berhasil dikirim dan menunggu moderasi');
    }

    public function updateModeration(
        \App\Http\Requests\Api\V1\Testimonial\UpdateTestimonialModerationRequest $request,
        Testimonial $testimonial,
    ): JsonResponse {
        $this->authorize('update', $testimonial);
        $item = $this->service->updateModeration(
            $testimonial,
            $request->validated('moderation_status'),
            $request->validated('status'),
        );

        return $this->success(new TestimonialResource($item), 'Moderation updated');
    }

    protected function bulkDeleteModelClass(): string
    {
        return Testimonial::class;
    }

    protected function bulkDeleteItem(\Illuminate\Database\Eloquent\Model $model): void
    {
        $this->service->delete($model);
    }
}
