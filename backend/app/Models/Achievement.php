<?php

namespace App\Models;

use App\Enums\PublishStatus;
use Database\Factories\AchievementFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Achievement extends Model
{
    /** @use HasFactory<AchievementFactory> */
    use HasFactory;

    protected $table = 'achievements';

    protected $fillable = [
        'title',
        'slug',
        'description',
        'image',
        'year',
        'category',
        'sort_order',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'year' => 'integer',
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
