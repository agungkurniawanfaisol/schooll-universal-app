<?php

namespace App\Models;

use Database\Factories\WebsiteSettingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WebsiteSetting extends Model
{
    /** @use HasFactory<WebsiteSettingFactory> */
    use HasFactory;

    protected $table = 'website_settings';

    protected $fillable = [
        'key',
        'value',
        'group',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'array',
        ];
    }
}
