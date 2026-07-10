<?php

namespace App\Models;

use Database\Factories\SeoSettingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SeoSetting extends Model
{
    /** @use HasFactory<SeoSettingFactory> */
    use HasFactory;

    protected $table = 'seo_settings';

    protected $fillable = [
        'page_key',
        'title',
        'description',
        'keywords',
        'canonical',
        'og_title',
        'og_description',
        'og_image',
        'twitter_title',
        'twitter_description',
        'twitter_image',
        'structured_data',
    ];

    protected function casts(): array
    {
        return [
            'structured_data' => 'array',
        ];
    }
}
