<?php

namespace App\Services;

use App\Models\NewsletterSubscriber;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class NewsletterService
{
    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = NewsletterSubscriber::query()->orderByDesc('subscribed_at');

        if (isset($filters['is_active'])) {
            $query->where('is_active', (bool) $filters['is_active']);
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search): void {
                $q->where('email', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage);
    }

    public function subscribe(array $data): NewsletterSubscriber
    {
        return NewsletterSubscriber::query()->updateOrCreate(
            ['email' => $data['email']],
            [
                'name' => $data['name'] ?? null,
                'is_active' => true,
                'subscribed_at' => now(),
            ],
        );
    }

    public function delete(NewsletterSubscriber $subscriber): bool
    {
        return (bool) $subscriber->delete();
    }

    public function exportAll(): Collection
    {
        return NewsletterSubscriber::query()
            ->where('is_active', true)
            ->orderBy('email')
            ->get();
    }
}
