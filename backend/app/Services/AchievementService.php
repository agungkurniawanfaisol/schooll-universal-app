<?php

namespace App\Services;

use App\DTOs\AchievementData;
use App\Models\Achievement;
use App\Repositories\Contracts\AchievementRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class AchievementService
{
    public function __construct(private AchievementRepositoryInterface $repository) {}

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

    public function create(AchievementData $data): Model
    {
        $attrs = $data->toArray();
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(Achievement::class, $attrs['title']);
        }

        return $this->repository->create($attrs);
    }

    public function update(Achievement $model, AchievementData $data): Model
    {
        $attrs = $data->toArray();
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(Achievement::class, $attrs['title'], $model->id);
        }

        return $this->repository->update($model, $attrs);
    }

    public function delete(Achievement $model): bool
    {
        return $this->repository->delete($model);
    }
}
