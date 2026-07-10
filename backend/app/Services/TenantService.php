<?php

namespace App\Services;

use App\DTOs\TenantData;
use App\Models\Tenant;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TenantService
{
    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Tenant::query()->orderBy('name');

        if (isset($filters['is_active'])) {
            $query->where('is_active', (bool) $filters['is_active']);
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('domain', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage);
    }

    public function find(int $id): ?Tenant
    {
        return Tenant::query()->find($id);
    }

    public function create(TenantData $data): Tenant
    {
        $attrs = $data->toArray();
        if (! empty($attrs['name']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(Tenant::class, $attrs['name']);
        }

        return Tenant::query()->create($attrs);
    }

    public function update(Tenant $tenant, TenantData $data): Tenant
    {
        $attrs = $data->toArray();
        if (! empty($attrs['name']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(Tenant::class, $attrs['name'], $tenant->id);
        }

        $tenant->update($attrs);

        return $tenant->fresh();
    }

    public function delete(Tenant $tenant): bool
    {
        return (bool) $tenant->delete();
    }
}
