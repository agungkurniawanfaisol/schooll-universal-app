<?php

namespace App\Models;

use App\Enums\PublishStatus;
use App\Models\Concerns\HasPublishWindow;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomPage extends Model
{
    use HasPublishWindow;

    protected $table = 'custom_pages';

    protected $fillable = [
        'tenant_id',
        'title',
        'slug',
        'content',
        'meta_title',
        'meta_description',
        'status',
        'preview_token',
        'publish_start_at',
        'publish_end_at',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'publish_start_at' => 'datetime',
            'publish_end_at' => 'datetime',
            'sort_order' => 'integer',
            'status' => PublishStatus::class,
        ];
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
