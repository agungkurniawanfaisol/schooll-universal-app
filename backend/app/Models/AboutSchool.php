<?php

namespace App\Models;

use App\Enums\PublishStatus;
use Database\Factories\AboutSchoolFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AboutSchool extends Model
{
    /** @use HasFactory<AboutSchoolFactory> */
    use HasFactory;

    protected $table = 'about_schools';

    protected $fillable = [
        'title',
        'content',
        'image',
        'video_url',
        'status',
    ];

    protected function casts(): array
    {
        return [
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
