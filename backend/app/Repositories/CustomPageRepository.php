<?php

namespace App\Repositories;

use App\Models\CustomPage;
use App\Repositories\Contracts\CustomPageRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class CustomPageRepository extends BaseRepository implements CustomPageRepositoryInterface
{
    public function __construct(CustomPage $model)
    {
        parent::__construct($model);
    }

    public function findByPreviewToken(string $token): ?Model
    {
        return $this->newQuery()->where('preview_token', $token)->first();
    }

    protected function searchableColumns(): array
    {
        return [
            'title',
            'content',
            'meta_title',
        ];
    }

    protected function defaultSortColumn(): string
    {
        return 'sort_order';
    }
}
