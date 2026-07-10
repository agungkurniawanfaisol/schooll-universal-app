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

    /** @param array<string, mixed> $data */
    public function submitPublic(array $data): Model
    {
        return $this->repository->create([
            'name' => $data['name'],
            'occupation' => $data['occupation'] ?? null,
            'rating' => $data['rating'],
            'comment' => $data['comment'],
            'submitter_email' => $data['submitter_email'] ?? null,
            'status' => 'draft',
            'moderation_status' => 'pending',
            'is_public_submission' => true,
            'sort_order' => 0,
        ]);
    }

    public function updateModeration(Testimonial $model, string $moderationStatus, ?string $status = null): Model
    {
        $attrs = ['moderation_status' => $moderationStatus];
        if ($status !== null) {
            $attrs['status'] = $status;
        } elseif ($moderationStatus === 'approved') {
            $attrs['status'] = 'published';
        }

        return $this->repository->update($model, $attrs);
    }
}
