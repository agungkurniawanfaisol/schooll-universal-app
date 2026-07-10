<?php

namespace App\Repositories;

use App\Models\Faq;
use App\Repositories\Contracts\FaqRepositoryInterface;

class FaqRepository extends BaseRepository implements FaqRepositoryInterface
{
    public function __construct(Faq $model)
    {
        parent::__construct($model);
    }

    protected function searchableColumns(): array
    {
        return [
            'question',
            'answer',
        ];
    }

    protected function defaultSortColumn(): string
    {
        return 'sort_order';
    }
}
