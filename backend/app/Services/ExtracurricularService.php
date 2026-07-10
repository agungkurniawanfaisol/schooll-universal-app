<?php

namespace App\Services;

use App\DTOs\ExtracurricularData;
use App\Models\Extracurricular;
use App\Repositories\Contracts\ExtracurricularRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class ExtracurricularService
{
    public function __construct(private ExtracurricularRepositoryInterface $repository) {}

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

    public function create(ExtracurricularData $data): Model
    {
        $attrs = $data->toArray();
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(Extracurricular::class, $attrs['title']);
        }

        return $this->repository->create($attrs);
    }

    public function update(Extracurricular $model, ExtracurricularData $data): Model
    {
        $attrs = $data->toArray();
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(Extracurricular::class, $attrs['title'], $model->id);
        }

        return $this->repository->update($model, $attrs);
    }

    public function delete(Extracurricular $model): bool
    {
        return $this->repository->delete($model);
    }
}
