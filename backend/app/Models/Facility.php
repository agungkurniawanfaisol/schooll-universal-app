<?php

namespace App\Models;

use App\Enums\PublishStatus;
use Database\Factories\FacilityFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facility extends Model
{
    /** @use HasFactory<FacilityFactory> */
    use HasFactory;

    protected $table = 'facilities';

    protected $fillable = [
        'title',
        'slug',
        'description',
        'image',
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
