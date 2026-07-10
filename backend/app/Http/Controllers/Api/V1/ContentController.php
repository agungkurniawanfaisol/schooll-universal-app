<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Api\V1\Content\UpdateAboutSchoolRequest;
use App\Http\Requests\Api\V1\Content\UpdateHeroSectionRequest;
use App\Http\Resources\AboutSchoolResource;
use App\Http\Resources\ContactInfoResource;
use App\Http\Resources\FooterSettingResource;
use App\Http\Resources\HeroSectionResource;
use App\Http\Resources\NavigationMenuResource;
use App\Http\Resources\PrincipalMessageResource;
use App\Http\Resources\SocialMediaResource;
use App\Http\Resources\VisionMissionResource;
use App\Models\AboutSchool;
use App\Models\ContactInfo;
use App\Models\FooterSetting;
use App\Models\HeroSection;
use App\Models\NavigationMenu;
use App\Models\PrincipalMessage;
use App\Models\SocialMedia;
use App\Models\VisionMission;
use App\Rules\SafeMediaUrl;
use App\Rules\SafeUrl;
use App\Services\ContentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContentController extends BaseApiController
{
    public function __construct(private ContentService $contentService) {}

    public function heroIndex(Request $request): JsonResponse
    {
        $this->authorize('viewAny', HeroSection::class);

        return $this->success(HeroSectionResource::collection(
            $this->contentService->getHeroSections()
        ));
    }

    public function heroStore(UpdateHeroSectionRequest $request): JsonResponse
    {
        $this->authorize('create', HeroSection::class);

        $hero = $this->contentService->updateContent(HeroSection::class, $request->validated());

        return $this->created(new HeroSectionResource($hero));
    }

    public function heroUpdate(UpdateHeroSectionRequest $request, HeroSection $heroSection): JsonResponse
    {
        $this->authorize('update', $heroSection);

        $hero = $this->contentService->updateContent(HeroSection::class, $request->validated(), $heroSection->id);

        return $this->success(new HeroSectionResource($hero));
    }

    public function aboutShow(Request $request): JsonResponse
    {
        $this->authorize('viewAny', AboutSchool::class);
        $about = AboutSchool::query()->latest()->first();

        return $this->success($about ? new AboutSchoolResource($about) : null);
    }

    public function aboutUpdate(UpdateAboutSchoolRequest $request): JsonResponse
    {
        abort_unless($request->user()->can('content.update'), 403);

        $about = $this->contentService->updateContent(AboutSchool::class, $request->validated());

        return $this->success(new AboutSchoolResource($about));
    }

    public function visionMissionIndex(Request $request): JsonResponse
    {
        $this->authorize('viewAny', VisionMission::class);

        return $this->success(VisionMissionResource::collection(
            $this->contentService->getVisionMissions()
        ));
    }

    public function visionMissionStore(Request $request): JsonResponse
    {
        $this->authorize('create', VisionMission::class);

        $data = $request->validate([
            'type' => 'required|in:vision,mission',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'icon' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer',
            'status' => 'nullable|in:draft,published,archived',
        ]);
        $data['content'] = strip_tags($data['content']);

        $item = VisionMission::query()->create($data);

        return $this->created(new VisionMissionResource($item));
    }

    public function visionMissionUpdate(Request $request, VisionMission $visionMission): JsonResponse
    {
        $this->authorize('update', $visionMission);

        $data = $request->validate([
            'type' => 'sometimes|in:vision,mission',
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'icon' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer',
            'status' => 'nullable|in:draft,published,archived',
        ]);
        if (array_key_exists('content', $data)) {
            $data['content'] = strip_tags($data['content']);
        }

        $visionMission->update($data);

        return $this->success(new VisionMissionResource($visionMission->fresh()));
    }

    public function principalShow(Request $request): JsonResponse
    {
        $this->authorize('viewAny', PrincipalMessage::class);
        $message = PrincipalMessage::query()->latest()->first();

        return $this->success($message ? new PrincipalMessageResource($message) : null);
    }

    public function principalUpdate(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('content.update'), 403);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'photo' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'message' => 'required|string',
            'status' => 'nullable|in:draft,published,archived',
        ]);
        $data['message'] = strip_tags($data['message']);

        $message = $this->contentService->updateContent(PrincipalMessage::class, $data);

        return $this->success(new PrincipalMessageResource($message));
    }

    public function contactInfoIndex(Request $request): JsonResponse
    {
        $this->authorize('viewAny', ContactInfo::class);

        return $this->success(ContactInfoResource::collection(ContactInfo::query()->orderBy('sort_order')->get()));
    }

    public function contactInfoStore(Request $request): JsonResponse
    {
        $this->authorize('create', ContactInfo::class);

        $data = $request->validate([
            'type' => 'required|string|max:50',
            'label' => 'nullable|string|max:255',
            'value' => 'required|string|max:500',
            'icon' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer',
        ]);

        $item = ContactInfo::query()->create($data);

        return $this->created(new ContactInfoResource($item));
    }

    public function contactInfoUpdate(Request $request, ContactInfo $contactInfo): JsonResponse
    {
        $this->authorize('update', $contactInfo);

        $data = $request->validate([
            'type' => 'sometimes|string|max:50',
            'label' => 'nullable|string|max:255',
            'value' => 'sometimes|string|max:500',
            'icon' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer',
        ]);

        $contactInfo->update($data);

        return $this->success(new ContactInfoResource($contactInfo->fresh()));
    }

    public function contactInfoDestroy(ContactInfo $contactInfo): JsonResponse
    {
        $this->authorize('delete', $contactInfo);
        $contactInfo->delete();

        return $this->noContent();
    }

    public function socialMediaIndex(Request $request): JsonResponse
    {
        $this->authorize('viewAny', SocialMedia::class);

        return $this->success(SocialMediaResource::collection(SocialMedia::query()->orderBy('sort_order')->get()));
    }

    public function socialMediaStore(Request $request): JsonResponse
    {
        $this->authorize('create', SocialMedia::class);

        $data = $request->validate([
            'platform' => 'required|string|max:50',
            'url' => ['required', 'string', 'max:500', new SafeUrl],
            'icon' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $item = SocialMedia::query()->create($data);

        return $this->created(new SocialMediaResource($item));
    }

    public function socialMediaUpdate(Request $request, SocialMedia $socialMedia): JsonResponse
    {
        $this->authorize('update', $socialMedia);

        $data = $request->validate([
            'platform' => 'sometimes|string|max:50',
            'url' => ['sometimes', 'string', 'max:500', new SafeUrl],
            'icon' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $socialMedia->update($data);

        return $this->success(new SocialMediaResource($socialMedia->fresh()));
    }

    public function socialMediaDestroy(SocialMedia $socialMedia): JsonResponse
    {
        $this->authorize('delete', $socialMedia);
        $socialMedia->delete();

        return $this->noContent();
    }

    public function navigationIndex(Request $request): JsonResponse
    {
        $this->authorize('viewAny', NavigationMenu::class);

        return $this->success(NavigationMenuResource::collection(
            NavigationMenu::query()->whereNull('parent_id')->with('children')->orderBy('sort_order')->get()
        ));
    }

    public function navigationStore(Request $request): JsonResponse
    {
        $this->authorize('create', NavigationMenu::class);

        $data = $request->validate([
            'label' => 'required|string|max:255',
            'url' => ['nullable', 'string', 'max:500', new SafeUrl],
            'sort_order' => 'nullable|integer',
            'is_external' => 'nullable|boolean',
            'parent_id' => 'nullable|exists:navigation_menus,id',
        ]);

        $item = NavigationMenu::query()->create($data);

        return $this->created(new NavigationMenuResource($item));
    }

    public function navigationUpdate(Request $request, NavigationMenu $navigationMenu): JsonResponse
    {
        $this->authorize('update', $navigationMenu);

        $data = $request->validate([
            'label' => 'sometimes|string|max:255',
            'url' => ['nullable', 'string', 'max:500', new SafeUrl],
            'sort_order' => 'nullable|integer',
            'is_external' => 'nullable|boolean',
            'parent_id' => 'nullable|exists:navigation_menus,id',
        ]);

        $navigationMenu->update($data);

        return $this->success(new NavigationMenuResource($navigationMenu->fresh()));
    }

    public function navigationDestroy(NavigationMenu $navigationMenu): JsonResponse
    {
        $this->authorize('delete', $navigationMenu);
        $navigationMenu->delete();

        return $this->noContent();
    }

    public function heroDestroy(HeroSection $heroSection): JsonResponse
    {
        $this->authorize('delete', $heroSection);
        $heroSection->delete();

        return $this->noContent();
    }

    public function footerShow(Request $request): JsonResponse
    {
        $this->authorize('viewAny', FooterSetting::class);
        $footer = FooterSetting::query()->latest()->first();

        return $this->success($footer ? new FooterSettingResource($footer) : null);
    }

    public function footerUpdate(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('content.update'), 403);

        $data = $request->validate([
            'copyright_text' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'logo' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'status' => 'nullable|in:draft,published,archived',
        ]);

        $footer = $this->contentService->updateContent(FooterSetting::class, $data);

        return $this->success(new FooterSettingResource($footer));
    }
}
