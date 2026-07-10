<?php

namespace App\Services;

use App\Models\WebsiteSetting;
use Illuminate\Support\Collection;

class SettingService
{
    public function all(?string $group = null): Collection
    {
        $query = WebsiteSetting::query();

        if ($group) {
            $query->where('group', $group);
        }

        return $query->orderBy('key')->get();
    }

    public function get(string $key, mixed $default = null): mixed
    {
        $setting = WebsiteSetting::query()->where('key', $key)->first();

        return $setting?->value ?? $default;
    }

    public function set(string $key, mixed $value, string $group = 'general'): WebsiteSetting
    {
        return WebsiteSetting::query()->updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'group' => $group],
        );
    }
}
