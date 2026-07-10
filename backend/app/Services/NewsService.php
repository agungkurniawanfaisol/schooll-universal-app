<?php

namespace App\Services;

use App\DTOs\NewsData;
use App\Models\News;
use App\Repositories\Contracts\NewsRepositoryInterface;
use App\Support\HtmlSanitizer;
use Illuminate\Database\Eloquent\Model;

class NewsService
{
    public function __construct(private NewsRepositoryInterface $repository) {}

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

    public function create(NewsData $data): Model
    {
        $attrs = $this->normalizePublishWindow($data->toArray());
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(News::class, $attrs['title']);
        }

        return $this->repository->create($attrs);
    }

    public function update(News $model, NewsData $data): Model
    {
        $attrs = $this->normalizePublishWindow($data->toArray());
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(News::class, $attrs['title'], $model->id);
        }

        return $this->repository->update($model, $attrs);
    }

    /** @param array<string, mixed> $attrs */
    private function normalizePublishWindow(array $attrs): array
    {
        if (array_key_exists('content', $attrs)) {
            $attrs['content'] = HtmlSanitizer::clean($attrs['content']);
        }

        if (empty($attrs['publish_start_at']) && ! empty($attrs['published_at'])) {
            $attrs['publish_start_at'] = $attrs['published_at'];
        }

        if (empty($attrs['published_at']) && ! empty($attrs['publish_start_at'])) {
            $attrs['published_at'] = $attrs['publish_start_at'];
        }

        return $attrs;
    }

    public function delete(News $model): bool
    {
        return $this->repository->delete($model);
    }

    public function isPubliclyVisible(News $news): bool
    {
        if ($news->status->value !== 'published') {
            return false;
        }

        $now = now();

        if ($news->publish_start_at && $news->publish_start_at->isAfter($now)) {
            return false;
        }

        if ($news->publish_end_at && $news->publish_end_at->isBefore($now)) {
            return false;
        }

        return true;
    }
}
