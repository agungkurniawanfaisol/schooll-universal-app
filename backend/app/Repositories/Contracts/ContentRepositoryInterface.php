<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface ContentRepositoryInterface
{
    public function getHeroSections(bool $publishedOnly = false): Collection;

    public function getAboutSchool(): ?Model;

    public function getVisionMissions(bool $publishedOnly = false): Collection;

    public function getPrincipalMessage(): ?Model;

    public function getContactInfos(): Collection;

    public function getSocialMedia(bool $activeOnly = true): Collection;

    public function getNavigationMenus(): Collection;

    public function getFooterSetting(): ?Model;

    public function updateSingleton(string $modelClass, array $data, ?int $id = null): Model;
}
