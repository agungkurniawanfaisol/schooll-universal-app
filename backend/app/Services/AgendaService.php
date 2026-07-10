<?php

namespace App\Services;

use App\DTOs\AgendaData;
use App\Models\Agenda;
use App\Repositories\Contracts\AgendaRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class AgendaService
{
    public function __construct(private AgendaRepositoryInterface $repository) {}

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

    public function create(AgendaData $data): Model
    {
        $attrs = $this->normalizePublishWindow($data->toArray());
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(Agenda::class, $attrs['title']);
        }

        return $this->repository->create($attrs);
    }

    public function update(Agenda $model, AgendaData $data): Model
    {
        $attrs = $this->normalizePublishWindow($data->toArray());
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(Agenda::class, $attrs['title'], $model->id);
        }

        return $this->repository->update($model, $attrs);
    }

    public function isPubliclyVisible(Agenda $agenda): bool
    {
        if ($agenda->status->value !== 'published') {
            return false;
        }

        $now = now();

        if ($agenda->publish_start_at && $agenda->publish_start_at->isAfter($now)) {
            return false;
        }

        if ($agenda->publish_end_at && $agenda->publish_end_at->isBefore($now)) {
            return false;
        }

        return true;
    }

    /** @param array<string, mixed> $attrs */
    private function normalizePublishWindow(array $attrs): array
    {
        if (empty($attrs['publish_start_at'])) {
            $attrs['publish_start_at'] = now();
        }

        return $attrs;
    }

    public function delete(Agenda $model): bool
    {
        return $this->repository->delete($model);
    }
}
