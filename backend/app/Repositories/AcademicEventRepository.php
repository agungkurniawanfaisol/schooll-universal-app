<?php

namespace App\Repositories;

use App\Models\AcademicEvent;
use App\Repositories\Contracts\AcademicEventRepositoryInterface;

class AcademicEventRepository extends BaseRepository implements AcademicEventRepositoryInterface
{
    public function __construct(AcademicEvent $model)
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
        return 'sort_order';
    }
}
