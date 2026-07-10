<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\DownloadDocumentData;
use App\Http\Requests\Api\V1\DownloadDocument\StoreDownloadDocumentRequest;
use App\Http\Requests\Api\V1\DownloadDocument\UpdateDownloadDocumentRequest;
use App\Http\Resources\DownloadDocumentResource;
use App\Models\DownloadDocument;
use App\Services\DownloadDocumentService;
use App\Traits\HandlesBulkDelete;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DownloadDocumentController extends BaseApiController
{
    use HandlesBulkDelete;

    public function __construct(private DownloadDocumentService $service) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', DownloadDocument::class);
        $items = $this->service->list($request->all(), (int) $request->get('per_page', 15));

        return $this->success(DownloadDocumentResource::collection($items));
    }

    public function store(StoreDownloadDocumentRequest $request): JsonResponse
    {
        $this->authorize('create', DownloadDocument::class);
        $item = $this->service->create(DownloadDocumentData::fromArray($request->validated()));

        return $this->created(new DownloadDocumentResource($item));
    }

    public function show(DownloadDocument $downloadDocument): JsonResponse
    {
        $this->authorize('view', $downloadDocument);

        return $this->success(new DownloadDocumentResource($downloadDocument));
    }

    public function update(UpdateDownloadDocumentRequest $request, DownloadDocument $downloadDocument): JsonResponse
    {
        $this->authorize('update', $downloadDocument);
        $item = $this->service->update($downloadDocument, DownloadDocumentData::fromArray($request->validated()));

        return $this->success(new DownloadDocumentResource($item), 'Updated successfully');
    }

    public function destroy(DownloadDocument $downloadDocument): JsonResponse
    {
        $this->authorize('delete', $downloadDocument);
        $this->service->delete($downloadDocument);

        return $this->noContent();
    }

    public function publicDownload(string $slug): \Symfony\Component\HttpFoundation\BinaryFileResponse|JsonResponse
    {
        $item = $this->service->findBySlug($slug);
        if (! $item || $item->status->value !== 'published') {
            return $this->error('Dokumen tidak ditemukan', 404);
        }

        $this->service->incrementDownloadCount($item);
        $path = storage_path('app/public/'.$item->file_path);
        if (! is_file($path)) {
            return $this->error('File tidak ditemukan', 404);
        }

        return response()->download($path, basename($item->file_path));
    }

    protected function bulkDeleteModelClass(): string
    {
        return DownloadDocument::class;
    }

    protected function bulkDeleteItem(Model $model): void
    {
        $this->service->delete($model);
    }
}
