<?php

namespace App\Services;

use App\DTOs\FacilityData;
use App\Models\Facility;
use App\Repositories\Contracts\FacilityRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class FacilityService
{
    public function __construct(private FacilityRepositoryInterface $repository) {}

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

    public function create(FacilityData $data): Model
    {
        $attrs = $data->toArray();
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(Facility::class, $attrs['title']);
        }

        return $this->repository->create($attrs);
    }

    public function update(Facility $model, FacilityData $data): Model
    {
        $attrs = $data->toArray();
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(Facility::class, $attrs['title'], $model->id);
        }

        return $this->repository->update($model, $attrs);
    }

    public function delete(Facility $model): bool
    {
        return $this->repository->delete($model);
    }
}
