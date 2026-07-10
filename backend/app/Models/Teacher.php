<?php

namespace App\Models;

use App\Enums\PublishStatus;
use Database\Factories\TeacherFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Teacher extends Model
{
    /** @use HasFactory<TeacherFactory> */
    use HasFactory;

    protected $table = 'teachers';

    protected $fillable = [
        'photo',
        'name',
        'slug',
        'position',
        'subject',
        'biography',
        'social_media',
        'sort_order',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'social_media' => 'array',
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
