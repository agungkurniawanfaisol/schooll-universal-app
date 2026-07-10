<?php

namespace App\Repositories;

use App\Models\Agenda;
use App\Repositories\Contracts\AgendaRepositoryInterface;

class AgendaRepository extends BaseRepository implements AgendaRepositoryInterface
{
    public function __construct(Agenda $model)
    {
        parent::__construct($model);
    }

    protected function searchableColumns(): array
    {
        return [
            'title',
            'location',
            'description',
        ];
    }

    protected function defaultSortColumn(): string
    {
        return 'date';
    }
}
