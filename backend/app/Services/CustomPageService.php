<?php

namespace App\Services;

use App\DTOs\CustomPageData;
use App\Models\CustomPage;
use App\Repositories\Contracts\CustomPageRepositoryInterface;
use App\Support\HtmlSanitizer;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CustomPageService
{
    public function __construct(private CustomPageRepositoryInterface $repository) {}

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

    public function findByPreviewToken(string $token): ?Model
    {
        return $this->repository->findByPreviewToken($token);
    }

    public function create(CustomPageData $data): Model
    {
        $attrs = $this->normalize($data->toArray());
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(CustomPage::class, $attrs['title']);
        }
        $attrs['preview_token'] = Str::random(64);

        return $this->repository->create($attrs);
    }

    public function update(CustomPage $model, CustomPageData $data): Model
    {
        $attrs = $this->normalize($data->toArray());
        if (! empty($attrs['title']) && empty($attrs['slug'])) {
            $attrs['slug'] = generate_unique_slug(CustomPage::class, $attrs['title'], $model->id);
        }

        return $this->repository->update($model, $attrs);
    }

    public function delete(CustomPage $model): bool
    {
        return $this->repository->delete($model);
    }

    public function isPubliclyVisible(CustomPage $page): bool
    {
        if ($page->status->value !== 'published') {
            return false;
        }

        $now = now();
        if ($page->publish_start_at && $page->publish_start_at->isAfter($now)) {
            return false;
        }
        if ($page->publish_end_at && $page->publish_end_at->isBefore($now)) {
            return false;
        }

        return true;
    }

    /** @param array<string, mixed> $attrs */
    private function normalize(array $attrs): array
    {
        if (array_key_exists('content', $attrs)) {
            $attrs['content'] = HtmlSanitizer::clean($attrs['content']);
        }

        return $attrs;
    }
}
