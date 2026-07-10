<?php

namespace App\Repositories;

use App\Models\DownloadDocument;
use App\Repositories\Contracts\DownloadDocumentRepositoryInterface;

class DownloadDocumentRepository extends BaseRepository implements DownloadDocumentRepositoryInterface
{
    public function __construct(DownloadDocument $model)
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
