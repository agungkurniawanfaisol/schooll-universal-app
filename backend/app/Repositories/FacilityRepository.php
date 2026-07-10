<?php

namespace App\Repositories;

use App\Models\Facility;
use App\Repositories\Contracts\FacilityRepositoryInterface;

class FacilityRepository extends BaseRepository implements FacilityRepositoryInterface
{
    public function __construct(Facility $model)
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
