<?php

namespace App\Models;

use App\Enums\PublishStatus;
use Database\Factories\HeroSectionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HeroSection extends Model
{
    /** @use HasFactory<HeroSectionFactory> */
    use HasFactory;

    protected $table = 'hero_sections';

    protected $fillable = [
        'title',
        'subtitle',
        'description',
        'background_image',
        'cta_text',
        'cta_url',
        'status',
        'sort_order',
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
