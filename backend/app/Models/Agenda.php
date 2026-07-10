<?php

namespace App\Models;

use App\Enums\PublishStatus;
use App\Models\Concerns\HasPublishWindow;
use Database\Factories\AgendaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Agenda extends Model
{
    /** @use HasFactory<AgendaFactory> */
    use HasFactory;
    use HasPublishWindow;

    protected $table = 'agendas';

    protected $fillable = [
        'thumbnail',
        'title',
        'slug',
        'date',
        'end_date',
        'time',
        'location',
        'description',
        'publish_start_at',
        'publish_end_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'end_date' => 'date',
            'publish_start_at' => 'datetime',
            'publish_end_at' => 'datetime',
            'status' => PublishStatus::class,
        ];
    }
}
