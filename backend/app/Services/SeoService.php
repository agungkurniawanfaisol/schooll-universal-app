<?php

namespace App\Services;

use App\Models\SeoSetting;
use Illuminate\Support\Collection;

class SeoService
{
    public function getByPageKey(string $pageKey): ?SeoSetting
    {
        return SeoSetting::query()->where('page_key', $pageKey)->first();
    }

    public function all(): Collection
    {
        return SeoSetting::query()->orderBy('page_key')->get();
    }

    public function upsert(string $pageKey, array $data): SeoSetting
    {
        return SeoSetting::query()->updateOrCreate(
            ['page_key' => $pageKey],
            $data,
        );
    }
}
