<?php

namespace App\Models;

use App\Enums\PublishStatus;
use Database\Factories\FooterSettingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FooterSetting extends Model
{
    /** @use HasFactory<FooterSettingFactory> */
    use HasFactory;

    protected $table = 'footer_settings';

    protected $fillable = [
        'copyright_text',
        'description',
        'logo',
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
