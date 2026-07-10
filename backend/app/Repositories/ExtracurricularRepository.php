<?php

namespace App\Repositories;

use App\Models\Extracurricular;
use App\Repositories\Contracts\ExtracurricularRepositoryInterface;

class ExtracurricularRepository extends BaseRepository implements ExtracurricularRepositoryInterface
{
    public function __construct(Extracurricular $model)
    {
        parent::__construct($model);
    }

    protected function searchableColumns(): array
    {
        return [
            'title',
            'description',
            'coach',
        ];
    }

    protected function defaultSortColumn(): string
    {
        return 'sort_order';
    }
}
