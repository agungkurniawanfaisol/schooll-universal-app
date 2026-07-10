<?php

namespace App\Models;

use App\Enums\PublishStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DownloadDocument extends Model
{
    protected $table = 'download_documents';

    protected $fillable = [
        'tenant_id',
        'title',
        'slug',
        'description',
        'file_path',
        'category',
        'download_count',
        'status',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'download_count' => 'integer',
            'sort_order' => 'integer',
            'status' => PublishStatus::class,
        ];
    }

    public function scopePublished($query)
    {
        return $query->where('status', PublishStatus::Published->value);
    }

    public function scopeDraft($query)
    {
        return $query->where('status', PublishStatus::Draft->value);
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
