<?php

namespace App\Services;

use App\DTOs\AcademicEventData;
use App\Models\AcademicEvent;
use App\Repositories\Contracts\AcademicEventRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class AcademicEventService
{
    public function __construct(private AcademicEventRepositoryInterface $repository) {}

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

    public function create(AcademicEventData $data): Model
    {
        $attrs = $data->toArray();
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(AcademicEvent::class, $attrs['title']);
        }

        return $this->repository->create($attrs);
    }

    public function update(AcademicEvent $model, AcademicEventData $data): Model
    {
        $attrs = $data->toArray();
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(AcademicEvent::class, $attrs['title'], $model->id);
        }

        return $this->repository->update($model, $attrs);
    }

    public function delete(AcademicEvent $model): bool
    {
        return $this->repository->delete($model);
    }
}
