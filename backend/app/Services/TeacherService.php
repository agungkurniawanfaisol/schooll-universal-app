<?php

namespace App\Services;

use App\DTOs\TeacherData;
use App\Models\Teacher;
use App\Repositories\Contracts\TeacherRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class TeacherService
{
    public function __construct(private TeacherRepositoryInterface $repository) {}

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

    public function create(TeacherData $data): Model
    {
        $attrs = $data->toArray();
        if (! empty($attrs['name']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(Teacher::class, $attrs['name']);
        }

        return $this->repository->create($attrs);
    }

    public function update(Teacher $model, TeacherData $data): Model
    {
        $attrs = $data->toArray();
        if (! empty($attrs['name']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(Teacher::class, $attrs['name'], $model->id);
        }

        return $this->repository->update($model, $attrs);
    }

    public function delete(Teacher $model): bool
    {
        return $this->repository->delete($model);
    }
}
