<?php

namespace App\Services;

use App\Repositories\Contracts\ContentRepositoryInterface;
use App\Support\HtmlSanitizer;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class ContentService
{
    public function __construct(private ContentRepositoryInterface $content) {}

    public function landingData(): array
    {
        return [
            'hero' => $this->content->getHeroSections(true),
            'about' => $this->content->getAboutSchool(),
            'vision_mission' => $this->content->getVisionMissions(true),
            'principal_message' => $this->content->getPrincipalMessage(),
            'contact_info' => $this->content->getContactInfos(),
            'social_media' => $this->content->getSocialMedia(),
            'navigation' => $this->content->getNavigationMenus(),
            'footer' => $this->content->getFooterSetting(),
        ];
    }

    public function updateContent(string $modelClass, array $data, ?int $id = null): Model
    {
        if (array_key_exists('content', $data)) {
            $data['content'] = HtmlSanitizer::clean($data['content']);
        }

        return $this->content->updateSingleton($modelClass, $data, $id);
    }

    public function getHeroSections(bool $publishedOnly = false): Collection
    {
        return $this->content->getHeroSections($publishedOnly);
    }

    public function getVisionMissions(bool $publishedOnly = false): Collection
    {
        return $this->content->getVisionMissions($publishedOnly);
    }
}
