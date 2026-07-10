<?php

namespace App\Repositories;

use App\Models\Activity;
use App\Repositories\Contracts\ActivityRepositoryInterface;

class ActivityRepository extends BaseRepository implements ActivityRepositoryInterface
{
    public function __construct(Activity $model)
    {
        parent::__construct($model);
    }

    protected function searchableColumns(): array
    {
        return [
            'title',
            'description',
        ];
    }

    protected function defaultSortColumn(): string
    {
        return 'date';
    }
}
