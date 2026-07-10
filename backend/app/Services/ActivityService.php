<?php

namespace App\Services;

use App\DTOs\ActivityData;
use App\Models\Activity;
use App\Repositories\Contracts\ActivityRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class ActivityService
{
    public function __construct(private ActivityRepositoryInterface $repository) {}

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

    public function create(ActivityData $data): Model
    {
        $attrs = $data->toArray();
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(Activity::class, $attrs['title']);
        }

        return $this->repository->create($attrs);
    }

    public function update(Activity $model, ActivityData $data): Model
    {
        $attrs = $data->toArray();
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(Activity::class, $attrs['title'], $model->id);
        }

        return $this->repository->update($model, $attrs);
    }

    public function delete(Activity $model): bool
    {
        return $this->repository->delete($model);
    }
}
