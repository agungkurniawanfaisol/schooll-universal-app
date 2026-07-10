<?php

use App\Http\Controllers\Api\V1\AcademicEventController;
use App\Http\Controllers\Api\V1\AchievementController;
use App\Http\Controllers\Api\V1\ActivityController;
use App\Http\Controllers\Api\V1\ActivityLogController;
use App\Http\Controllers\Api\V1\AgendaController;
use App\Http\Controllers\Api\V1\AnalyticsController;
use App\Http\Controllers\Api\V1\ApiTokenController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BackupController;
use App\Http\Controllers\Api\V1\ContactController;
use App\Http\Controllers\Api\V1\ContentController;
use App\Http\Controllers\Api\V1\CustomPageController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\DownloadDocumentController;
use App\Http\Controllers\Api\V1\ExtracurricularController;
use App\Http\Controllers\Api\V1\FacilityController;
use App\Http\Controllers\Api\V1\FaqController;
use App\Http\Controllers\Api\V1\GalleryController;
use App\Http\Controllers\Api\V1\MediaController;
use App\Http\Controllers\Api\V1\NewsController;
use App\Http\Controllers\Api\V1\NewsletterController;
use App\Http\Controllers\Api\V1\PermissionController;
use App\Http\Controllers\Api\V1\PpdbController;
use App\Http\Controllers\Api\V1\PreviewController;
use App\Http\Controllers\Api\V1\PublicController;
use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\SeoController;
use App\Http\Controllers\Api\V1\SettingController;
use App\Http\Controllers\Api\V1\TeacherController;
use App\Http\Controllers\Api\V1\TeacherExportController;
use App\Http\Controllers\Api\V1\TenantController;
use App\Http\Controllers\Api\V1\TestimonialController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\WebhookController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::prefix('public')->middleware(['throttle:public', 'track.pageview'])->group(function (): void {
        Route::get('landing', [PublicController::class, 'landing']);
        Route::get('vision-mission', [PublicController::class, 'visionMission']);
        Route::get('teachers', [PublicController::class, 'teachers']);
        Route::get('teachers/{slug}', [PublicController::class, 'teacherShow']);
        Route::get('activities', [PublicController::class, 'activities']);
        Route::get('activities/{slug}', [PublicController::class, 'activityShow']);
        Route::get('agendas', [PublicController::class, 'agendas']);
        Route::get('agendas/{slug}', [PublicController::class, 'agendaShow']);
        Route::get('galleries', [PublicController::class, 'galleries']);
        Route::get('galleries/{slug}', [PublicController::class, 'galleryShow']);
        Route::get('testimonials', [PublicController::class, 'testimonials']);
        Route::get('facilities', [PublicController::class, 'facilities']);
        Route::get('facilities/{slug}', [PublicController::class, 'facilityShow']);
        Route::get('achievements', [PublicController::class, 'achievements']);
        Route::get('achievements/{slug}', [PublicController::class, 'achievementShow']);
        Route::get('news', [PublicController::class, 'news']);
        Route::get('news/{slug}', [PublicController::class, 'newsShow']);
        Route::get('pages', [PublicController::class, 'pages']);
        Route::get('pages/{slug}', [PublicController::class, 'pageShow']);
        Route::get('faqs', [PublicController::class, 'faqs']);
        Route::get('downloads', [PublicController::class, 'downloads']);
        Route::get('downloads/{slug}/file', [DownloadDocumentController::class, 'publicDownload']);
        Route::get('academic-events', [PublicController::class, 'academicEvents']);
        Route::get('extracurriculars', [PublicController::class, 'extracurriculars']);
        Route::get('extracurriculars/{slug}', [PublicController::class, 'extracurricularShow']);
        Route::post('testimonials/submit', [TestimonialController::class, 'submitPublic']);
        Route::get('preview/{token}', [PreviewController::class, 'show']);
        Route::post('contact', [ContactController::class, 'submit']);
        Route::post('ppdb', [PpdbController::class, 'submit']);
        Route::get('ppdb/status/{registrationNumber}', [PpdbController::class, 'checkStatus']);
        Route::post('newsletter/subscribe', [NewsletterController::class, 'subscribe']);
    });

    Route::prefix('auth')->middleware('throttle:auth')->group(function (): void {
        Route::post('login', [AuthController::class, 'login']);
    });

    Route::middleware(['auth:sanctum', 'throttle:api'])->group(function (): void {
        Route::prefix('auth')->group(function (): void {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
            Route::patch('profile', [AuthController::class, 'updateProfile']);
            Route::post('refresh', [AuthController::class, 'refresh']);
        });

        Route::get('dashboard', [DashboardController::class, 'index'])
            ->middleware('permission:dashboard.view');

        Route::get('analytics', [AnalyticsController::class, 'index'])
            ->middleware('permission:analytics.view');

        Route::get('activity-logs', [ActivityLogController::class, 'index'])
            ->middleware('permission:audit.view');

        Route::get('teachers/export', [TeacherExportController::class, 'export']);
        Route::post('teachers/import', [TeacherExportController::class, 'import']);
        Route::post('teachers/bulk-delete', [TeacherController::class, 'bulkDestroy']);
        Route::post('agendas/bulk-delete', [AgendaController::class, 'bulkDestroy']);
        Route::post('galleries/bulk-delete', [GalleryController::class, 'bulkDestroy']);
        Route::post('testimonials/bulk-delete', [TestimonialController::class, 'bulkDestroy']);
        Route::post('activities/bulk-delete', [ActivityController::class, 'bulkDestroy']);
        Route::post('facilities/bulk-delete', [FacilityController::class, 'bulkDestroy']);
        Route::post('achievements/bulk-delete', [AchievementController::class, 'bulkDestroy']);
        Route::post('news/bulk-delete', [NewsController::class, 'bulkDestroy']);
        Route::post('users/bulk-delete', [UserController::class, 'bulkDestroy']);
        Route::post('media/bulk-delete', [MediaController::class, 'bulkDestroy']);
        Route::post('custom-pages/bulk-delete', [CustomPageController::class, 'bulkDestroy']);
        Route::post('academic-events/bulk-delete', [AcademicEventController::class, 'bulkDestroy']);
        Route::post('download-documents/bulk-delete', [DownloadDocumentController::class, 'bulkDestroy']);
        Route::post('faqs/bulk-delete', [FaqController::class, 'bulkDestroy']);
        Route::post('extracurriculars/bulk-delete', [ExtracurricularController::class, 'bulkDestroy']);

        Route::apiResource('users', UserController::class);
        Route::apiResource('roles', RoleController::class);
        Route::get('permissions', [PermissionController::class, 'index'])
            ->middleware('permission:permissions.view');

        Route::apiResource('media', MediaController::class)->except(['update']);
        Route::apiResource('teachers', TeacherController::class);
        Route::apiResource('activities', ActivityController::class);
        Route::apiResource('agendas', AgendaController::class);
        Route::apiResource('galleries', GalleryController::class);
        Route::apiResource('testimonials', TestimonialController::class);
        Route::patch('testimonials/{testimonial}/moderation', [TestimonialController::class, 'updateModeration']);
        Route::apiResource('facilities', FacilityController::class);
        Route::apiResource('achievements', AchievementController::class);
        Route::apiResource('news', NewsController::class);
        Route::apiResource('custom-pages', CustomPageController::class);
        Route::apiResource('academic-events', AcademicEventController::class);
        Route::apiResource('download-documents', DownloadDocumentController::class);
        Route::apiResource('faqs', FaqController::class);
        Route::apiResource('extracurriculars', ExtracurricularController::class);
        Route::apiResource('tenants', TenantController::class);
        Route::apiResource('webhooks', WebhookController::class);
        Route::post('webhooks/{webhook}/test', [WebhookController::class, 'test']);
        Route::apiResource('api-tokens', ApiTokenController::class);
        Route::post('api-tokens/{api_token}/regenerate', [ApiTokenController::class, 'regenerate']);

        Route::get('ppdb', [PpdbController::class, 'index']);
        Route::get('ppdb/{ppdbRegistration}', [PpdbController::class, 'show']);
        Route::patch('ppdb/{ppdbRegistration}/status', [PpdbController::class, 'updateStatus']);

        Route::get('newsletter/subscribers', [NewsletterController::class, 'index']);
        Route::get('newsletter/subscribers/export', [NewsletterController::class, 'export']);
        Route::delete('newsletter/subscribers/{newsletterSubscriber}', [NewsletterController::class, 'destroy']);

        Route::post('backup/create', [BackupController::class, 'create']);
        Route::get('backup/download', [BackupController::class, 'download']);

        Route::prefix('content')->group(function (): void {
            Route::get('hero', [ContentController::class, 'heroIndex']);
            Route::post('hero', [ContentController::class, 'heroStore']);
            Route::put('hero/{heroSection}', [ContentController::class, 'heroUpdate']);
            Route::get('about', [ContentController::class, 'aboutShow']);
            Route::put('about', [ContentController::class, 'aboutUpdate']);
            Route::get('vision-mission', [ContentController::class, 'visionMissionIndex']);
            Route::post('vision-mission', [ContentController::class, 'visionMissionStore']);
            Route::put('vision-mission/{visionMission}', [ContentController::class, 'visionMissionUpdate']);
            Route::get('principal', [ContentController::class, 'principalShow']);
            Route::put('principal', [ContentController::class, 'principalUpdate']);
            Route::get('contact-info', [ContentController::class, 'contactInfoIndex']);
            Route::post('contact-info', [ContentController::class, 'contactInfoStore']);
            Route::put('contact-info/{contactInfo}', [ContentController::class, 'contactInfoUpdate']);
            Route::delete('contact-info/{contactInfo}', [ContentController::class, 'contactInfoDestroy']);
            Route::get('social-media', [ContentController::class, 'socialMediaIndex']);
            Route::post('social-media', [ContentController::class, 'socialMediaStore']);
            Route::put('social-media/{socialMedia}', [ContentController::class, 'socialMediaUpdate']);
            Route::delete('social-media/{socialMedia}', [ContentController::class, 'socialMediaDestroy']);
            Route::get('navigation', [ContentController::class, 'navigationIndex']);
            Route::post('navigation', [ContentController::class, 'navigationStore']);
            Route::put('navigation/{navigationMenu}', [ContentController::class, 'navigationUpdate']);
            Route::delete('navigation/{navigationMenu}', [ContentController::class, 'navigationDestroy']);
            Route::delete('hero/{heroSection}', [ContentController::class, 'heroDestroy']);
            Route::get('footer', [ContentController::class, 'footerShow']);
            Route::put('footer', [ContentController::class, 'footerUpdate']);
        });

        Route::apiResource('settings', SettingController::class);

        Route::get('seo', [SeoController::class, 'index']);
        Route::post('seo', [SeoController::class, 'store']);
        Route::get('seo/{pageKey}', [SeoController::class, 'show']);
        Route::put('seo/{pageKey}', [SeoController::class, 'update']);
        Route::delete('seo/{seoSetting}', [SeoController::class, 'destroy']);

        Route::get('contacts', [ContactController::class, 'index']);
        Route::get('contacts/{contactSubmission}', [ContactController::class, 'show']);
        Route::patch('contacts/{contactSubmission}/read', [ContactController::class, 'markAsRead']);
        Route::delete('contacts/{contactSubmission}', [ContactController::class, 'destroy']);
    });
});
