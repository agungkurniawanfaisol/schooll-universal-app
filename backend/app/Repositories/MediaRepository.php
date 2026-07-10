<?php

namespace App\Repositories;

use App\Models\Media;
use App\Repositories\Contracts\MediaRepositoryInterface;

class MediaRepository extends BaseRepository implements MediaRepositoryInterface
{
    public function __construct(Media $model)
    {
        parent::__construct($model);
    }

    protected function searchableColumns(): array
    {
        return [
            'filename',
            'original_name',
            'alt_text',
        ];
    }

    protected function defaultSortColumn(): string
    {
        return 'created_at';
    }
}
