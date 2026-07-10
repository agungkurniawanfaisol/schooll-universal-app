<?php

namespace App\Models;

use Database\Factories\MediaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Media extends Model
{
    /** @use HasFactory<MediaFactory> */
    use HasFactory;

    protected $table = 'media';

    protected $fillable = [
        'uuid',
        'filename',
        'original_name',
        'mime_type',
        'size',
        'disk',
        'path',
        'alt_text',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'size' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
