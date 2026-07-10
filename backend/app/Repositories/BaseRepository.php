<?php

namespace App\Repositories;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository implements RepositoryInterface
{
    public function __construct(protected Model $model) {}

    public function all(array $filters = []): Collection
    {
        return $this->applyFilters($this->newQuery(), $filters)->get();
    }

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->applyFilters($this->newQuery(), $filters)->paginate($perPage);
    }

    public function find(int $id): ?Model
    {
        return $this->newQuery()->find($id);
    }

    public function findBySlug(string $slug): ?Model
    {
        if (! $this->hasColumn('slug')) {
            return null;
        }

        return $this->newQuery()->where('slug', $slug)->first();
    }

    public function create(array $data): Model
    {
        return $this->model->newQuery()->create($data);
    }

    public function update(Model $model, array $data): Model
    {
        $model->update($data);

        return $model->fresh();
    }

    public function delete(Model $model): bool
    {
        return (bool) $model->delete();
    }

    protected function newQuery(): Builder
    {
        return $this->model->newQuery();
    }

    protected function applyFilters(Builder $query, array $filters): Builder
    {
        if (! empty($filters['search']) && $this->searchableColumns()) {
            $query->where(function (Builder $q) use ($filters) {
                foreach ($this->searchableColumns() as $column) {
                    $q->orWhere($column, 'like', '%'.$filters['search'].'%');
                }
            });
        }

        if (! empty($filters['status']) && $this->hasColumn('status')) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['published_only']) && $this->hasColumn('status')) {
            $query->where('status', 'published');
        }

        if (! empty($filters['approved_only']) && $this->hasColumn('moderation_status')) {
            $query->where('moderation_status', 'approved');
        }

        if (! empty($filters['pending_moderation']) && $this->hasColumn('moderation_status')) {
            $query->where('moderation_status', 'pending');
        }

        if (! empty($filters['visible_now'])) {
            $now = now();
            $query->where('status', 'published')
                ->where(function (Builder $q) use ($now) {
                    $q->whereNull('publish_start_at')->orWhere('publish_start_at', '<=', $now);
                })
                ->where(function (Builder $q) use ($now) {
                    $q->whereNull('publish_end_at')->orWhere('publish_end_at', '>=', $now);
                });
        }

        if (! empty($filters['date_from']) && $this->hasColumn('publish_start_at')) {
            $query->where('publish_start_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to']) && $this->hasColumn('publish_start_at')) {
            $query->where('publish_start_at', '<=', $filters['date_to']);
        }

        if (! empty($filters['upcoming']) && $this->hasColumn('date')) {
            $query->where('date', '>=', now()->toDateString());
        }

        foreach ($filters as $key => $value) {
            if (in_array($key, ['search', 'status', 'published_only', 'approved_only', 'pending_moderation', 'visible_now', 'date_from', 'date_to', 'upcoming', 'sort', 'direction', 'per_page', 'page', 'all'], true)) {
                continue;
            }
            if ($this->hasColumn($key) && $value !== null && $value !== '') {
                $query->where($key, $value);
            }
        }

        $sort = $filters['sort'] ?? $this->defaultSortColumn();
        $direction = strtolower($filters['direction'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        if ($this->hasColumn($sort)) {
            $query->orderBy($sort, $direction);
        }

        return $query;
    }

    protected function searchableColumns(): array
    {
        return ['title', 'name'];
    }

    protected function defaultSortColumn(): string
    {
        return $this->hasColumn('sort_order') ? 'sort_order' : 'created_at';
    }

    protected function hasColumn(string $column): bool
    {
        return in_array($column, $this->model->getFillable(), true)
            || in_array($column, ['id', 'created_at', 'updated_at', 'status', 'slug', 'sort_order', 'publish_start_at', 'publish_end_at', 'published_at'], true);
    }
}
