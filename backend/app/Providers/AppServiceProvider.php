<?php

namespace App\Providers;

use App\Models\AboutSchool;
use App\Models\AcademicEvent;
use App\Models\Achievement;
use App\Models\Activity;
use App\Models\ActivityLog;
use App\Models\Agenda;
use App\Models\ApiToken;
use App\Models\ContactInfo;
use App\Models\ContactSubmission;
use App\Models\CustomPage;
use App\Models\DownloadDocument;
use App\Models\Extracurricular;
use App\Models\Facility;
use App\Models\Faq;
use App\Models\FooterSetting;
use App\Models\Gallery;
use App\Models\HeroSection;
use App\Models\Media;
use App\Models\NavigationMenu;
use App\Models\News;
use App\Models\NewsletterSubscriber;
use App\Models\PpdbRegistration;
use App\Models\PrincipalMessage;
use App\Models\SocialMedia;
use App\Models\Teacher;
use App\Models\Tenant;
use App\Models\Testimonial;
use App\Models\User;
use App\Models\VisionMission;
use App\Models\Webhook;
use App\Models\WebsiteSetting;
use App\Policies\AboutSchoolPolicy;
use App\Policies\AcademicEventPolicy;
use App\Policies\AchievementPolicy;
use App\Policies\ActivityLogPolicy;
use App\Policies\ActivityPolicy;
use App\Policies\AgendaPolicy;
use App\Policies\ApiTokenPolicy;
use App\Policies\ContactSubmissionPolicy;
use App\Policies\CustomPagePolicy;
use App\Policies\DownloadDocumentPolicy;
use App\Policies\ExtracurricularPolicy;
use App\Policies\FacilityPolicy;
use App\Policies\FaqPolicy;
use App\Policies\FooterSettingPolicy;
use App\Policies\GalleryPolicy;
use App\Policies\HeroSectionPolicy;
use App\Policies\MediaPolicy;
use App\Policies\NavigationMenuPolicy;
use App\Policies\NewsletterSubscriberPolicy;
use App\Policies\NewsPolicy;
use App\Policies\PpdbRegistrationPolicy;
use App\Policies\PrincipalMessagePolicy;
use App\Policies\SeoSettingPolicy;
use App\Policies\TeacherPolicy;
use App\Policies\TenantPolicy;
use App\Policies\TestimonialPolicy;
use App\Policies\UserPolicy;
use App\Policies\VisionMissionPolicy;
use App\Policies\WebhookPolicy;
use App\Policies\WebsiteSettingPolicy;
use App\Repositories\AcademicEventRepository;
use App\Repositories\AchievementRepository;
use App\Repositories\ActivityRepository;
use App\Repositories\AgendaRepository;
use App\Repositories\ContentRepository;
use App\Repositories\Contracts\AcademicEventRepositoryInterface;
use App\Repositories\Contracts\AchievementRepositoryInterface;
use App\Repositories\Contracts\ActivityRepositoryInterface;
use App\Repositories\Contracts\AgendaRepositoryInterface;
use App\Repositories\Contracts\ContentRepositoryInterface;
use App\Repositories\Contracts\CustomPageRepositoryInterface;
use App\Repositories\Contracts\DownloadDocumentRepositoryInterface;
use App\Repositories\Contracts\ExtracurricularRepositoryInterface;
use App\Repositories\Contracts\FacilityRepositoryInterface;
use App\Repositories\Contracts\FaqRepositoryInterface;
use App\Repositories\Contracts\GalleryRepositoryInterface;
use App\Repositories\Contracts\MediaRepositoryInterface;
use App\Repositories\Contracts\NewsRepositoryInterface;
use App\Repositories\Contracts\TeacherRepositoryInterface;
use App\Repositories\Contracts\TestimonialRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\CustomPageRepository;
use App\Repositories\DownloadDocumentRepository;
use App\Repositories\ExtracurricularRepository;
use App\Repositories\FacilityRepository;
use App\Repositories\FaqRepository;
use App\Repositories\GalleryRepository;
use App\Repositories\MediaRepository;
use App\Repositories\NewsRepository;
use App\Repositories\TeacherRepository;
use App\Repositories\TestimonialRepository;
use App\Repositories\UserRepository;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(MediaRepositoryInterface::class, MediaRepository::class);
        $this->app->bind(TeacherRepositoryInterface::class, TeacherRepository::class);
        $this->app->bind(ActivityRepositoryInterface::class, ActivityRepository::class);
        $this->app->bind(AgendaRepositoryInterface::class, AgendaRepository::class);
        $this->app->bind(GalleryRepositoryInterface::class, GalleryRepository::class);
        $this->app->bind(TestimonialRepositoryInterface::class, TestimonialRepository::class);
        $this->app->bind(FacilityRepositoryInterface::class, FacilityRepository::class);
        $this->app->bind(AchievementRepositoryInterface::class, AchievementRepository::class);
        $this->app->bind(NewsRepositoryInterface::class, NewsRepository::class);
        $this->app->bind(ContentRepositoryInterface::class, ContentRepository::class);
        $this->app->bind(CustomPageRepositoryInterface::class, CustomPageRepository::class);
        $this->app->bind(AcademicEventRepositoryInterface::class, AcademicEventRepository::class);
        $this->app->bind(DownloadDocumentRepositoryInterface::class, DownloadDocumentRepository::class);
        $this->app->bind(FaqRepositoryInterface::class, FaqRepository::class);
        $this->app->bind(ExtracurricularRepositoryInterface::class, ExtracurricularRepository::class);
    }

    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(120)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });

        RateLimiter::for('public', function (Request $request) {
            return Limit::perMinute(60)->by($request->ip());
        });

        Gate::before(function ($user, $ability) {
            return $user->hasRole('Super Admin') ? true : null;
        });

        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Media::class, MediaPolicy::class);
        Gate::policy(Teacher::class, TeacherPolicy::class);
        Gate::policy(Activity::class, ActivityPolicy::class);
        Gate::policy(Agenda::class, AgendaPolicy::class);
        Gate::policy(Gallery::class, GalleryPolicy::class);
        Gate::policy(Testimonial::class, TestimonialPolicy::class);
        Gate::policy(Facility::class, FacilityPolicy::class);
        Gate::policy(Achievement::class, AchievementPolicy::class);
        Gate::policy(News::class, NewsPolicy::class);
        Gate::policy(ContactSubmission::class, ContactSubmissionPolicy::class);
        Gate::policy(HeroSection::class, HeroSectionPolicy::class);
        Gate::policy(AboutSchool::class, AboutSchoolPolicy::class);
        Gate::policy(VisionMission::class, VisionMissionPolicy::class);
        Gate::policy(PrincipalMessage::class, PrincipalMessagePolicy::class);
        Gate::policy(SeoSetting::class, SeoSettingPolicy::class);
        Gate::policy(WebsiteSetting::class, WebsiteSettingPolicy::class);
        Gate::policy(NavigationMenu::class, NavigationMenuPolicy::class);
        Gate::policy(FooterSetting::class, FooterSettingPolicy::class);
        Gate::policy(ContactInfo::class, HeroSectionPolicy::class);
        Gate::policy(SocialMedia::class, HeroSectionPolicy::class);
        Gate::policy(CustomPage::class, CustomPagePolicy::class);
        Gate::policy(AcademicEvent::class, AcademicEventPolicy::class);
        Gate::policy(DownloadDocument::class, DownloadDocumentPolicy::class);
        Gate::policy(Faq::class, FaqPolicy::class);
        Gate::policy(Extracurricular::class, ExtracurricularPolicy::class);
        Gate::policy(PpdbRegistration::class, PpdbRegistrationPolicy::class);
        Gate::policy(NewsletterSubscriber::class, NewsletterSubscriberPolicy::class);
        Gate::policy(ActivityLog::class, ActivityLogPolicy::class);
        Gate::policy(Webhook::class, WebhookPolicy::class);
        Gate::policy(ApiToken::class, ApiTokenPolicy::class);
        Gate::policy(Tenant::class, TenantPolicy::class);
    }
}
