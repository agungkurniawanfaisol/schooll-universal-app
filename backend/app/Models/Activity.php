<?php

namespace App\Models;

use App\Enums\PublishStatus;
use Database\Factories\ActivityFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Activity extends Model
{
    /** @use HasFactory<ActivityFactory> */
    use HasFactory;

    protected $table = 'activities';

    protected $fillable = [
        'title',
        'slug',
        'description',
        'image',
        'date',
        'sort_order',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
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
