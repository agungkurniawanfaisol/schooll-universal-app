<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Api\V1\Media\UploadMediaRequest;
use App\Http\Resources\MediaResource;
use App\Models\Media;
use App\Repositories\Contracts\MediaRepositoryInterface;
use App\Services\MediaService;
use App\Traits\HandlesBulkDelete;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MediaController extends BaseApiController
{
    use HandlesBulkDelete;

    public function __construct(
        private MediaService $mediaService,
        private MediaRepositoryInterface $mediaRepository,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Media::class);
        $media = $this->mediaRepository->paginate($request->all(), (int) $request->get('per_page', 20));

        return $this->success(MediaResource::collection($media));
    }

    public function store(UploadMediaRequest $request): JsonResponse
    {
        $this->authorize('create', Media::class);
        $media = $this->mediaService->upload(
            $request->file('file'),
            $request->user()->id,
            $request->input('alt_text'),
        );

        return $this->created(new MediaResource($media));
    }

    public function show(Media $medium): JsonResponse
    {
        $this->authorize('view', $medium);

        return $this->success(new MediaResource($medium));
    }

    public function destroy(Media $medium): JsonResponse
    {
        $this->authorize('delete', $medium);
        $this->mediaService->delete($medium);

        return $this->noContent();
    }

    protected function bulkDeleteModelClass(): string
    {
        return Media::class;
    }

    protected function bulkDeleteItem(\Illuminate\Database\Eloquent\Model $model): void
    {
        $this->mediaService->delete($model);
    }
}
