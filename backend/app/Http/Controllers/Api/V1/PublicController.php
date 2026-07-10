<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\PublishStatus;
use App\Http\Resources\AboutSchoolResource;
use App\Http\Resources\AcademicEventResource;
use App\Http\Resources\AchievementResource;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\AgendaResource;
use App\Http\Resources\ContactInfoResource;
use App\Http\Resources\CustomPageResource;
use App\Http\Resources\DownloadDocumentResource;
use App\Http\Resources\ExtracurricularResource;
use App\Http\Resources\FacilityResource;
use App\Http\Resources\FaqResource;
use App\Http\Resources\FooterSettingResource;
use App\Http\Resources\GalleryResource;
use App\Http\Resources\HeroSectionResource;
use App\Http\Resources\NavigationMenuResource;
use App\Http\Resources\NewsResource;
use App\Http\Resources\PrincipalMessageResource;
use App\Http\Resources\SeoSettingResource;
use App\Http\Resources\SocialMediaResource;
use App\Http\Resources\TeacherResource;
use App\Http\Resources\TestimonialResource;
use App\Http\Resources\VisionMissionResource;
use App\Services\AcademicEventService;
use App\Services\AchievementService;
use App\Services\ActivityService;
use App\Services\AgendaService;
use App\Services\ContentService;
use App\Services\CustomPageService;
use App\Services\DownloadDocumentService;
use App\Services\ExtracurricularService;
use App\Services\FacilityService;
use App\Services\FaqService;
use App\Services\GalleryService;
use App\Services\NewsService;
use App\Services\SeoService;
use App\Services\SettingService;
use App\Services\TeacherService;
use App\Services\TestimonialService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicController extends BaseApiController
{
    public function __construct(
        private ContentService $contentService,
        private SettingService $settingService,
        private SeoService $seoService,
        private TeacherService $teacherService,
        private ActivityService $activityService,
        private AgendaService $agendaService,
        private GalleryService $galleryService,
        private TestimonialService $testimonialService,
        private FacilityService $facilityService,
        private AchievementService $achievementService,
        private NewsService $newsService,
        private CustomPageService $customPageService,
        private AcademicEventService $academicEventService,
        private DownloadDocumentService $downloadDocumentService,
        private FaqService $faqService,
        private ExtracurricularService $extracurricularService,
    ) {}

    public function landing(): JsonResponse
    {
        $data = $this->contentService->landingData();

        $newsPreview = $this->newsService->list([
            'visible_now' => true,
            'all' => true,
            'sort' => 'publish_start_at',
            'direction' => 'desc',
        ])->take(6);

        $agendaPreview = $this->agendaService->list([
            'visible_now' => true,
            'upcoming' => true,
            'all' => true,
            'sort' => 'date',
            'direction' => 'asc',
        ])->take(4);

        $teacherPreview = $this->teacherService->list([
            'published_only' => true,
            'all' => true,
            'sort' => 'sort_order',
            'direction' => 'asc',
        ])->take(4);

        $activityPreview = $this->activityService->list([
            'published_only' => true,
            'all' => true,
            'sort' => 'date',
            'direction' => 'desc',
        ])->take(4);

        $galleryPreview = $this->galleryService->list([
            'published_only' => true,
            'all' => true,
            'sort' => 'sort_order',
            'direction' => 'asc',
        ])->take(6);

        $testimonialPreview = $this->testimonialService->list([
            'published_only' => true,
            'approved_only' => true,
            'all' => true,
            'sort' => 'sort_order',
            'direction' => 'asc',
        ])->take(3);

        $facilityPreview = $this->facilityService->list([
            'published_only' => true,
            'all' => true,
            'sort' => 'sort_order',
            'direction' => 'asc',
        ])->take(4);

        $achievementPreview = $this->achievementService->list([
            'published_only' => true,
            'all' => true,
            'sort' => 'year',
            'direction' => 'desc',
        ])->take(4);

        $faqPreview = $this->faqService->list([
            'published_only' => true,
            'all' => true,
            'sort' => 'sort_order',
            'direction' => 'asc',
        ])->take(6);

        $extracurricularPreview = $this->extracurricularService->list([
            'published_only' => true,
            'all' => true,
            'sort' => 'sort_order',
            'direction' => 'asc',
        ])->take(4);

        $academicEventPreview = $this->academicEventService->list([
            'published_only' => true,
            'all' => true,
            'sort' => 'start_date',
            'direction' => 'asc',
        ])->take(6);

        return $this->success([
            'hero' => HeroSectionResource::collection($data['hero']),
            'about' => $data['about'] ? new AboutSchoolResource($data['about']) : null,
            'vision_mission' => VisionMissionResource::collection($data['vision_mission']),
            'principal_message' => $data['principal_message'] ? new PrincipalMessageResource($data['principal_message']) : null,
            'teachers' => TeacherResource::collection($teacherPreview),
            'activities' => ActivityResource::collection($activityPreview),
            'agendas' => AgendaResource::collection($agendaPreview),
            'galleries' => GalleryResource::collection($galleryPreview),
            'testimonials' => TestimonialResource::collection($testimonialPreview),
            'facilities' => FacilityResource::collection($facilityPreview),
            'achievements' => AchievementResource::collection($achievementPreview),
            'news' => NewsResource::collection($newsPreview),
            'faqs' => FaqResource::collection($faqPreview),
            'extracurriculars' => ExtracurricularResource::collection($extracurricularPreview),
            'academic_events' => AcademicEventResource::collection($academicEventPreview),
            'contact_info' => ContactInfoResource::collection($data['contact_info']),
            'social_media' => SocialMediaResource::collection($data['social_media']),
            'navigation' => NavigationMenuResource::collection($data['navigation']),
            'footer' => $data['footer'] ? new FooterSettingResource($data['footer']) : null,
            'settings' => [
                'school_name' => data_get($this->settingService->get('school_name'), 'text'),
                'school_tagline' => data_get($this->settingService->get('school_tagline'), 'text'),
                'school_logo' => data_get($this->settingService->get('school_logo'), 'url'),
                'ppdb_url' => data_get($this->settingService->get('ppdb_url'), 'url'),
                'splash_screen_enabled' => (bool) data_get(
                    $this->settingService->get('splash_screen_enabled'),
                    'enabled',
                    true,
                ),
                'hero_stats' => $this->settingService->get('hero_stats', []),
            ],
            'seo' => ($seo = $this->seoService->getByPageKey('home'))
                ? new SeoSettingResource($seo)
                : null,
        ]);
    }

    public function visionMission(): JsonResponse
    {
        return $this->success(VisionMissionResource::collection(
            $this->contentService->getVisionMissions(true)
        ));
    }

    public function teachers(Request $request): JsonResponse
    {
        $paginator = $this->teacherService->list(
            [
                'published_only' => true,
                'search' => $request->get('search'),
                'sort' => $request->get('sort', 'sort_order'),
                'direction' => $request->get('direction', 'asc'),
            ],
            (int) $request->get('per_page', 9),
        );

        return $this->paginatedResource($paginator, TeacherResource::class);
    }

    public function teacherShow(string $slug): JsonResponse
    {
        $item = $this->teacherService->findBySlug($slug);

        if (! $item || ! $this->isPublished($item)) {
            return $this->error('Guru tidak ditemukan', 404);
        }

        return $this->success(new TeacherResource($item));
    }

    public function activities(Request $request): JsonResponse
    {
        $paginator = $this->activityService->list(
            [
                'published_only' => true,
                'search' => $request->get('search'),
                'sort' => $request->get('sort', 'date'),
                'direction' => $request->get('direction', 'desc'),
            ],
            (int) $request->get('per_page', 9),
        );

        return $this->paginatedResource($paginator, ActivityResource::class);
    }

    public function activityShow(string $slug): JsonResponse
    {
        $item = $this->activityService->findBySlug($slug);

        if (! $item || ! $this->isPublished($item)) {
            return $this->error('Kegiatan tidak ditemukan', 404);
        }

        return $this->success(new ActivityResource($item));
    }

    public function agendas(Request $request): JsonResponse
    {
        $filters = [
            'visible_now' => true,
            'sort' => $request->get('sort', 'date'),
            'direction' => $request->get('direction', 'asc'),
            'search' => $request->get('search'),
            'date_from' => $request->get('date_from'),
            'date_to' => $request->get('date_to'),
        ];

        $paginator = $this->agendaService->list(
            $filters,
            (int) $request->get('per_page', 9),
        );

        return $this->paginatedResource($paginator, AgendaResource::class);
    }

    public function agendaShow(string $slug): JsonResponse
    {
        $item = $this->agendaService->findBySlug($slug);

        if (! $item || ! $this->agendaService->isPubliclyVisible($item)) {
            return $this->error('Agenda tidak ditemukan', 404);
        }

        return $this->success(new AgendaResource($item));
    }

    public function galleries(Request $request): JsonResponse
    {
        $paginator = $this->galleryService->list(
            [
                'published_only' => true,
                'search' => $request->get('search'),
                'sort' => $request->get('sort', 'sort_order'),
                'direction' => $request->get('direction', 'asc'),
            ],
            (int) $request->get('per_page', 9),
        );

        return $this->paginatedResource($paginator, GalleryResource::class);
    }

    public function galleryShow(string $slug): JsonResponse
    {
        $item = $this->galleryService->findBySlug($slug);

        if (! $item || ! $this->isPublished($item)) {
            return $this->error('Galeri tidak ditemukan', 404);
        }

        return $this->success(new GalleryResource($item));
    }

    public function testimonials(Request $request): JsonResponse
    {
        $paginator = $this->testimonialService->list(
            [
                'published_only' => true,
                'approved_only' => true,
                'search' => $request->get('search'),
                'sort' => $request->get('sort', 'sort_order'),
                'direction' => $request->get('direction', 'asc'),
            ],
            (int) $request->get('per_page', 9),
        );

        return $this->paginatedResource($paginator, TestimonialResource::class);
    }

    public function facilities(Request $request): JsonResponse
    {
        $paginator = $this->facilityService->list(
            [
                'published_only' => true,
                'search' => $request->get('search'),
                'sort' => $request->get('sort', 'sort_order'),
                'direction' => $request->get('direction', 'asc'),
            ],
            (int) $request->get('per_page', 9),
        );

        return $this->paginatedResource($paginator, FacilityResource::class);
    }

    public function facilityShow(string $slug): JsonResponse
    {
        $item = $this->facilityService->findBySlug($slug);

        if (! $item || ! $this->isPublished($item)) {
            return $this->error('Fasilitas tidak ditemukan', 404);
        }

        return $this->success(new FacilityResource($item));
    }

    public function achievements(Request $request): JsonResponse
    {
        $paginator = $this->achievementService->list(
            [
                'published_only' => true,
                'search' => $request->get('search'),
                'sort' => $request->get('sort', 'year'),
                'direction' => $request->get('direction', 'desc'),
            ],
            (int) $request->get('per_page', 9),
        );

        return $this->paginatedResource($paginator, AchievementResource::class);
    }

    public function achievementShow(string $slug): JsonResponse
    {
        $item = $this->achievementService->findBySlug($slug);

        if (! $item || ! $this->isPublished($item)) {
            return $this->error('Prestasi tidak ditemukan', 404);
        }

        return $this->success(new AchievementResource($item));
    }

    public function news(Request $request): JsonResponse
    {
        $filters = [
            'visible_now' => true,
            'sort' => $request->get('sort', 'publish_start_at'),
            'direction' => $request->get('direction', 'desc'),
            'search' => $request->get('search'),
            'date_from' => $request->get('date_from'),
            'date_to' => $request->get('date_to'),
        ];

        $paginator = $this->newsService->list(
            $filters,
            (int) $request->get('per_page', 9),
        );

        return $this->paginatedResource($paginator, NewsResource::class);
    }

    public function newsShow(string $slug): JsonResponse
    {
        $item = $this->newsService->findBySlug($slug);

        if (! $item || ! $this->newsService->isPubliclyVisible($item)) {
            return $this->error('Berita tidak ditemukan', 404);
        }

        return $this->success(new NewsResource($item));
    }

    public function pages(Request $request): JsonResponse
    {
        $paginator = $this->customPageService->list(
            ['visible_now' => true, 'search' => $request->get('search')],
            (int) $request->get('per_page', 12),
        );

        return $this->paginatedResource($paginator, CustomPageResource::class);
    }

    public function pageShow(string $slug): JsonResponse
    {
        $item = $this->customPageService->findBySlug($slug);
        if (! $item || ! $this->customPageService->isPubliclyVisible($item)) {
            return $this->error('Halaman tidak ditemukan', 404);
        }

        return $this->success(new CustomPageResource($item));
    }

    public function faqs(Request $request): JsonResponse
    {
        $paginator = $this->faqService->list(
            [
                'published_only' => true,
                'search' => $request->get('search'),
                'category' => $request->get('category'),
                'sort' => 'sort_order',
                'direction' => 'asc',
            ],
            (int) $request->get('per_page', 20),
        );

        return $this->paginatedResource($paginator, FaqResource::class);
    }

    public function downloads(Request $request): JsonResponse
    {
        $paginator = $this->downloadDocumentService->list(
            [
                'published_only' => true,
                'search' => $request->get('search'),
                'category' => $request->get('category'),
                'sort' => 'sort_order',
                'direction' => 'asc',
            ],
            (int) $request->get('per_page', 20),
        );

        return $this->paginatedResource($paginator, DownloadDocumentResource::class);
    }

    public function academicEvents(Request $request): JsonResponse
    {
        $paginator = $this->academicEventService->list(
            [
                'published_only' => true,
                'search' => $request->get('search'),
                'event_type' => $request->get('event_type'),
                'sort' => 'start_date',
                'direction' => 'asc',
            ],
            (int) $request->get('per_page', 50),
        );

        return $this->paginatedResource($paginator, AcademicEventResource::class);
    }

    public function extracurriculars(Request $request): JsonResponse
    {
        $paginator = $this->extracurricularService->list(
            [
                'published_only' => true,
                'search' => $request->get('search'),
                'sort' => 'sort_order',
                'direction' => 'asc',
            ],
            (int) $request->get('per_page', 12),
        );

        return $this->paginatedResource($paginator, ExtracurricularResource::class);
    }

    public function extracurricularShow(string $slug): JsonResponse
    {
        $item = $this->extracurricularService->findBySlug($slug);
        if (! $item || ! $this->isPublished($item)) {
            return $this->error('Ekstrakurikuler tidak ditemukan', 404);
        }

        return $this->success(new ExtracurricularResource($item));
    }

    private function isPublished(Model $item): bool
    {
        if (! isset($item->status)) {
            return true;
        }

        $status = $item->status;

        if ($status instanceof PublishStatus) {
            return $status === PublishStatus::Published;
        }

        return $status === PublishStatus::Published->value;
    }
}
