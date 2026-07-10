<?php

namespace App\Repositories;

use App\Models\Testimonial;
use App\Repositories\Contracts\TestimonialRepositoryInterface;

class TestimonialRepository extends BaseRepository implements TestimonialRepositoryInterface
{
    public function __construct(Testimonial $model)
    {
        parent::__construct($model);
    }

    protected function searchableColumns(): array
    {
        return [
            'name',
            'occupation',
            'comment',
        ];
    }

    protected function defaultSortColumn(): string
    {
        return 'sort_order';
    }
}
