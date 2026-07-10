<?php

namespace App\Models;

use App\Enums\PublishStatus;
use Database\Factories\PrincipalMessageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PrincipalMessage extends Model
{
    /** @use HasFactory<PrincipalMessageFactory> */
    use HasFactory;

    protected $table = 'principal_messages';

    protected $fillable = [
        'name',
        'title',
        'photo',
        'message',
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
