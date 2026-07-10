<?php

namespace App\Models;

use App\Enums\PublishStatus;
use Database\Factories\TestimonialFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Testimonial extends Model
{
    /** @use HasFactory<TestimonialFactory> */
    use HasFactory;

    protected $table = 'testimonials';

    protected $fillable = [
        'photo',
        'name',
        'occupation',
        'rating',
        'comment',
        'sort_order',
        'status',
        'moderation_status',
        'submitter_email',
        'is_public_submission',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'sort_order' => 'integer',
            'status' => PublishStatus::class,
            'is_public_submission' => 'boolean',
        ];
    }

    public function scopeApproved($query)
    {
        return $query->where('moderation_status', 'approved');
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
