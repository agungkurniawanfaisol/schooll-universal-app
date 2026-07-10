<?php

namespace App\Models;

use Database\Factories\NavigationMenuFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NavigationMenu extends Model
{
    /** @use HasFactory<NavigationMenuFactory> */
    use HasFactory;

    protected $table = 'navigation_menus';

    protected $fillable = [
        'label',
        'url',
        'sort_order',
        'is_external',
        'parent_id',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_external' => 'boolean',
        ];
    }

    public function parent()
    {
        return $this->belongsTo(NavigationMenu::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(NavigationMenu::class, 'parent_id')->orderBy('sort_order');
    }
}
