<?php

namespace App\Repositories;

use App\Models\Achievement;
use App\Repositories\Contracts\AchievementRepositoryInterface;

class AchievementRepository extends BaseRepository implements AchievementRepositoryInterface
{
    public function __construct(Achievement $model)
    {
        parent::__construct($model);
    }

    protected function searchableColumns(): array
    {
        return [
            'title',
            'description',
            'category',
        ];
    }

    protected function defaultSortColumn(): string
    {
        return 'year';
    }
}
