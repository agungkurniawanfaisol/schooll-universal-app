<?php

namespace App\Models;

use Database\Factories\ContactInfoFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ContactInfo extends Model
{
    /** @use HasFactory<ContactInfoFactory> */
    use HasFactory;

    protected $table = 'contact_infos';

    protected $fillable = [
        'type',
        'label',
        'value',
        'icon',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }
}
