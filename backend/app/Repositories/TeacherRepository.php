<?php

namespace App\Repositories;

use App\Models\Teacher;
use App\Repositories\Contracts\TeacherRepositoryInterface;

class TeacherRepository extends BaseRepository implements TeacherRepositoryInterface
{
    public function __construct(Teacher $model)
    {
        parent::__construct($model);
    }

    protected function searchableColumns(): array
    {
        return [
            'name',
            'position',
            'subject',
        ];
    }

    protected function defaultSortColumn(): string
    {
        return 'sort_order';
    }
}
