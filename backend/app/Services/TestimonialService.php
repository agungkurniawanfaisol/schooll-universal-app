<?php

namespace App\Services;

use App\DTOs\TestimonialData;
use App\Models\Testimonial;
use App\Repositories\Contracts\TestimonialRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class TestimonialService
{
    public function __construct(private TestimonialRepositoryInterface $repository) {}

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

    public function create(TestimonialData $data): Model
    {
        $attrs = $data->toArray();
        return $this->repository->create($attrs);
    }

    public function update(Testimonial $model, TestimonialData $data): Model
    {
        $attrs = $data->toArray();
        return $this->repository->update($model, $attrs);
    }

    public function delete(Testimonial $model): bool
    {
        return $this->repository->delete($model);
    }
}
