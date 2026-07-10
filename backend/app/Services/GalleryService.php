<?php

namespace App\Services;

use App\DTOs\GalleryData;
use App\Models\Gallery;
use App\Repositories\Contracts\GalleryRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class GalleryService
{
    public function __construct(private GalleryRepositoryInterface $repository) {}

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

    public function create(GalleryData $data): Model
    {
        $attrs = $data->toArray();
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(Gallery::class, $attrs['title']);
        }

        return $this->repository->create($attrs);
    }

    public function update(Gallery $model, GalleryData $data): Model
    {
        $attrs = $data->toArray();
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(Gallery::class, $attrs['title'], $model->id);
        }

        return $this->repository->update($model, $attrs);
    }

    public function delete(Gallery $model): bool
    {
        return $this->repository->delete($model);
    }
}
