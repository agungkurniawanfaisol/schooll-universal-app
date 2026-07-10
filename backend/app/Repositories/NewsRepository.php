<?php

namespace App\Repositories;

use App\Models\News;
use App\Repositories\Contracts\NewsRepositoryInterface;

class NewsRepository extends BaseRepository implements NewsRepositoryInterface
{
    public function __construct(News $model)
    {
        parent::__construct($model);
    }

    protected function searchableColumns(): array
    {
        return [
            'title',
            'excerpt',
            'content',
        ];
    }

    protected function defaultSortColumn(): string
    {
        return 'publish_start_at';
    }
}
