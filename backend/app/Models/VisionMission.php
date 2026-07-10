<?php

namespace App\Models;

use App\Enums\PublishStatus;
use Database\Factories\VisionMissionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VisionMission extends Model
{
    /** @use HasFactory<VisionMissionFactory> */
    use HasFactory;

    protected $table = 'vision_missions';

    protected $fillable = [
        'type',
        'title',
        'content',
        'icon',
        'sort_order',
        'status',
    ];

    protected function casts(): array
    {
        return [
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
