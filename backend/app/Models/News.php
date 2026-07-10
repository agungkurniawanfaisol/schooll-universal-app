<?php

namespace App\Models;

use App\Enums\PublishStatus;
use App\Models\Concerns\HasPublishWindow;
use Database\Factories\NewsFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class News extends Model
{
    /** @use HasFactory<NewsFactory> */
    use HasFactory;
    use HasPublishWindow;

    protected $table = 'news';

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'thumbnail',
        'published_at',
        'publish_start_at',
        'publish_end_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'publish_start_at' => 'datetime',
            'publish_end_at' => 'datetime',
            'status' => PublishStatus::class,
        ];
    }
}
