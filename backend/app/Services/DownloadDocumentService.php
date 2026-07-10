<?php

namespace App\Services;

use App\DTOs\DownloadDocumentData;
use App\Models\DownloadDocument;
use App\Repositories\Contracts\DownloadDocumentRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class DownloadDocumentService
{
    public function __construct(private DownloadDocumentRepositoryInterface $repository) {}

    public function list(array $filters = [], int $perPage = 15)
    {
        if (! empty($filters['all'])) {
            return $this->repository->all($filters);
        }

        return $this->repository->paginate($filters, $perPage);
    }

    public function find(int $id): ?Model
    {
        return $this->repository->find($id);
    }

    public function findBySlug(string $slug): ?Model
    {
        return $this->repository->findBySlug($slug);
    }

    public function create(DownloadDocumentData $data): Model
    {
        $attrs = $data->toArray();
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(DownloadDocument::class, $attrs['title']);
        }

        return $this->repository->create($attrs);
    }

    public function update(DownloadDocument $model, DownloadDocumentData $data): Model
    {
        $attrs = $data->toArray();
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(DownloadDocument::class, $attrs['title'], $model->id);
        }

        return $this->repository->update($model, $attrs);
    }

    public function delete(DownloadDocument $model): bool
    {
        return $this->repository->delete($model);
    }

    public function incrementDownloadCount(DownloadDocument $model): DownloadDocument
    {
        $model->increment('download_count');

        return $model->fresh();
    }
}
