<?php

namespace App\Models;

use App\Enums\PublishStatus;
use Database\Factories\GalleryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Gallery extends Model
{
    /** @use HasFactory<GalleryFactory> */
    use HasFactory;

    protected $table = 'galleries';

    protected $fillable = [
        'title',
        'slug',
        'description',
        'cover_image',
        'images',
        'sort_order',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
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
}
