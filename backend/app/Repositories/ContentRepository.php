<?php

namespace App\Repositories;

use App\Models\AboutSchool;
use App\Models\ContactInfo;
use App\Models\FooterSetting;
use App\Models\HeroSection;
use App\Models\NavigationMenu;
use App\Models\PrincipalMessage;
use App\Models\SocialMedia;
use App\Models\VisionMission;
use App\Repositories\Contracts\ContentRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class ContentRepository implements ContentRepositoryInterface
{
    public function getHeroSections(bool $publishedOnly = false): Collection
    {
        $query = HeroSection::query()->orderBy('sort_order');

        if ($publishedOnly) {
            $query->published();
        }

        return $query->get();
    }

    public function getAboutSchool(): ?Model
    {
        return AboutSchool::query()->latest()->first();
    }

    public function getVisionMissions(bool $publishedOnly = false): Collection
    {
        $query = VisionMission::query()->orderBy('sort_order');

        if ($publishedOnly) {
            $query->published();
        }

        return $query->get();
    }

    public function getPrincipalMessage(): ?Model
    {
        return PrincipalMessage::query()->latest()->first();
    }

    public function getContactInfos(): Collection
    {
        return ContactInfo::query()->orderBy('sort_order')->get();
    }

    public function getSocialMedia(bool $activeOnly = true): Collection
    {
        $query = SocialMedia::query()->orderBy('sort_order');

        if ($activeOnly) {
            $query->where('is_active', true);
        }

        return $query->get();
    }

    public function getNavigationMenus(): Collection
    {
        return NavigationMenu::query()
            ->whereNull('parent_id')
            ->with('children')
            ->orderBy('sort_order')
            ->get();
    }

    public function getFooterSetting(): ?Model
    {
        return FooterSetting::query()->latest()->first();
    }

    public function updateSingleton(string $modelClass, array $data, ?int $id = null): Model
    {
        if ($id) {
            $model = $modelClass::query()->findOrFail($id);
            $model->update($data);

            return $model->fresh();
        }

        $existing = $modelClass::query()->latest()->first();

        if ($existing) {
            $existing->update($data);

            return $existing->fresh();
        }

        return $modelClass::query()->create($data);
    }
}
