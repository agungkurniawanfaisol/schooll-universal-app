import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { PermissionRoute } from '@/routes/PermissionRoute'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

const LandingPage = lazy(() =>
  import('@/pages/landing/LandingPage').then((m) => ({ default: m.LandingPage })),
)
const NewsDetailPage = lazy(() =>
  import('@/pages/landing/NewsDetailPage').then((m) => ({ default: m.NewsDetailPage })),
)
const NewsListPublicPage = lazy(() =>
  import('@/pages/landing/NewsListPublicPage').then((m) => ({ default: m.NewsListPublicPage })),
)
const AgendaListPublicPage = lazy(() =>
  import('@/pages/landing/AgendaListPublicPage').then((m) => ({ default: m.AgendaListPublicPage })),
)
const AgendaDetailPage = lazy(() =>
  import('@/pages/landing/AgendaDetailPage').then((m) => ({ default: m.AgendaDetailPage })),
)
const VisionMissionPublicPage = lazy(() =>
  import('@/pages/landing/VisionMissionPublicPage').then((m) => ({ default: m.VisionMissionPublicPage })),
)
const TeachersListPublicPage = lazy(() =>
  import('@/pages/landing/TeachersListPublicPage').then((m) => ({ default: m.TeachersListPublicPage })),
)
const TeacherDetailPage = lazy(() =>
  import('@/pages/landing/TeacherDetailPage').then((m) => ({ default: m.TeacherDetailPage })),
)
const ActivitiesListPublicPage = lazy(() =>
  import('@/pages/landing/ActivitiesListPublicPage').then((m) => ({ default: m.ActivitiesListPublicPage })),
)
const ActivityDetailPage = lazy(() =>
  import('@/pages/landing/ActivityDetailPage').then((m) => ({ default: m.ActivityDetailPage })),
)
const GalleryListPublicPage = lazy(() =>
  import('@/pages/landing/GalleryListPublicPage').then((m) => ({ default: m.GalleryListPublicPage })),
)
const GalleryDetailPage = lazy(() =>
  import('@/pages/landing/GalleryDetailPage').then((m) => ({ default: m.GalleryDetailPage })),
)
const FacilitiesListPublicPage = lazy(() =>
  import('@/pages/landing/FacilitiesListPublicPage').then((m) => ({ default: m.FacilitiesListPublicPage })),
)
const FacilityDetailPage = lazy(() =>
  import('@/pages/landing/FacilityDetailPage').then((m) => ({ default: m.FacilityDetailPage })),
)
const TestimonialsListPublicPage = lazy(() =>
  import('@/pages/landing/TestimonialsListPublicPage').then((m) => ({ default: m.TestimonialsListPublicPage })),
)
const AchievementsListPublicPage = lazy(() =>
  import('@/pages/landing/AchievementsListPublicPage').then((m) => ({ default: m.AchievementsListPublicPage })),
)
const AchievementDetailPage = lazy(() =>
  import('@/pages/landing/AchievementDetailPage').then((m) => ({ default: m.AchievementDetailPage })),
)
const LoginPage = lazy(() =>
  import('@/pages/authentication/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)

const TeachersListPage = lazy(() =>
  import('@/pages/dashboard/teachers/TeachersListPage').then((m) => ({
    default: m.TeachersListPage,
  })),
)
const TeacherFormPage = lazy(() =>
  import('@/pages/dashboard/teachers/TeacherFormPage').then((m) => ({
    default: m.TeacherFormPage,
  })),
)
const AgendaListPage = lazy(() =>
  import('@/pages/dashboard/agenda/AgendaListPage').then((m) => ({
    default: m.AgendaListPage,
  })),
)
const AgendaFormPage = lazy(() =>
  import('@/pages/dashboard/agenda/AgendaFormPage').then((m) => ({
    default: m.AgendaFormPage,
  })),
)
const GalleryListPage = lazy(() =>
  import('@/pages/dashboard/gallery/GalleryListPage').then((m) => ({
    default: m.GalleryListPage,
  })),
)
const GalleryFormPage = lazy(() =>
  import('@/pages/dashboard/gallery/GalleryFormPage').then((m) => ({
    default: m.GalleryFormPage,
  })),
)
const TestimonialsListPage = lazy(() =>
  import('@/pages/dashboard/testimonials/TestimonialsListPage').then((m) => ({
    default: m.TestimonialsListPage,
  })),
)
const TestimonialFormPage = lazy(() =>
  import('@/pages/dashboard/testimonials/TestimonialFormPage').then((m) => ({
    default: m.TestimonialFormPage,
  })),
)
const ActivitiesListPage = lazy(() =>
  import('@/pages/dashboard/activities/ActivitiesListPage').then((m) => ({
    default: m.ActivitiesListPage,
  })),
)
const ActivityFormPage = lazy(() =>
  import('@/pages/dashboard/activities/ActivityFormPage').then((m) => ({
    default: m.ActivityFormPage,
  })),
)
const FacilitiesListPage = lazy(() =>
  import('@/pages/dashboard/facilities/FacilitiesListPage').then((m) => ({
    default: m.FacilitiesListPage,
  })),
)
const FacilityFormPage = lazy(() =>
  import('@/pages/dashboard/facilities/FacilityFormPage').then((m) => ({
    default: m.FacilityFormPage,
  })),
)
const AchievementsListPage = lazy(() =>
  import('@/pages/dashboard/achievements/AchievementsListPage').then((m) => ({
    default: m.AchievementsListPage,
  })),
)
const AchievementFormPage = lazy(() =>
  import('@/pages/dashboard/achievements/AchievementFormPage').then((m) => ({
    default: m.AchievementFormPage,
  })),
)
const NewsListPage = lazy(() =>
  import('@/pages/dashboard/news/NewsListPage').then((m) => ({
    default: m.NewsListPage,
  })),
)
const NewsFormPage = lazy(() =>
  import('@/pages/dashboard/news/NewsFormPage').then((m) => ({
    default: m.NewsFormPage,
  })),
)
const UsersListPage = lazy(() =>
  import('@/pages/dashboard/users/UsersListPage').then((m) => ({
    default: m.UsersListPage,
  })),
)
const UserFormPage = lazy(() =>
  import('@/pages/dashboard/users/UserFormPage').then((m) => ({
    default: m.UserFormPage,
  })),
)
const RolesListPage = lazy(() =>
  import('@/pages/dashboard/roles/RolesListPage').then((m) => ({
    default: m.RolesListPage,
  })),
)
const RoleFormPage = lazy(() =>
  import('@/pages/dashboard/roles/RoleFormPage').then((m) => ({
    default: m.RoleFormPage,
  })),
)
const ContactsListPage = lazy(() =>
  import('@/pages/dashboard/contacts/ContactsListPage').then((m) => ({
    default: m.ContactsListPage,
  })),
)
const ProfilePage = lazy(() =>
  import('@/pages/dashboard/profile/ProfilePage').then((m) => ({
    default: m.ProfilePage,
  })),
)
const MediaManagerPage = lazy(() =>
  import('@/pages/dashboard/media/MediaManagerPage').then((m) => ({
    default: m.MediaManagerPage,
  })),
)
const HeroSettingsPage = lazy(() =>
  import('@/pages/dashboard/settings/HeroSettingsPage').then((m) => ({
    default: m.HeroSettingsPage,
  })),
)
const AboutSettingsPage = lazy(() =>
  import('@/pages/dashboard/settings/AboutSettingsPage').then((m) => ({
    default: m.AboutSettingsPage,
  })),
)
const VisionMissionSettingsPage = lazy(() =>
  import('@/pages/dashboard/settings/VisionMissionSettingsPage').then((m) => ({
    default: m.VisionMissionSettingsPage,
  })),
)
const ContactSettingsPage = lazy(() =>
  import('@/pages/dashboard/settings/ContactSettingsPage').then((m) => ({
    default: m.ContactSettingsPage,
  })),
)
const SeoSettingsPage = lazy(() =>
  import('@/pages/dashboard/settings/SeoSettingsPage').then((m) => ({
    default: m.SeoSettingsPage,
  })),
)
const NavigationSettingsPage = lazy(() =>
  import('@/pages/dashboard/settings/NavigationSettingsPage').then((m) => ({
    default: m.NavigationSettingsPage,
  })),
)
const FooterSettingsPage = lazy(() =>
  import('@/pages/dashboard/settings/FooterSettingsPage').then((m) => ({
    default: m.FooterSettingsPage,
  })),
)
const SocialSettingsPage = lazy(() =>
  import('@/pages/dashboard/settings/SocialSettingsPage').then((m) => ({
    default: m.SocialSettingsPage,
  })),
)
const PrincipalSettingsPage = lazy(() =>
  import('@/pages/dashboard/settings/PrincipalSettingsPage').then((m) => ({
    default: m.PrincipalSettingsPage,
  })),
)
const GeneralSettingsPage = lazy(() =>
  import('@/pages/dashboard/settings/GeneralSettingsPage').then((m) => ({
    default: m.GeneralSettingsPage,
  })),
)
const CustomPagesListPage = lazy(() =>
  import('@/pages/dashboard/custom-pages/CustomPagesListPage').then((m) => ({
    default: m.CustomPagesListPage,
  })),
)
const CustomPageFormPage = lazy(() =>
  import('@/pages/dashboard/custom-pages/CustomPageFormPage').then((m) => ({
    default: m.CustomPageFormPage,
  })),
)
const AcademicEventsListPage = lazy(() =>
  import('@/pages/dashboard/academic-events/AcademicEventsListPage').then((m) => ({
    default: m.AcademicEventsListPage,
  })),
)
const AcademicEventFormPage = lazy(() =>
  import('@/pages/dashboard/academic-events/AcademicEventFormPage').then((m) => ({
    default: m.AcademicEventFormPage,
  })),
)
const DownloadsListPage = lazy(() =>
  import('@/pages/dashboard/downloads/DownloadsListPage').then((m) => ({
    default: m.DownloadsListPage,
  })),
)
const DownloadFormPage = lazy(() =>
  import('@/pages/dashboard/downloads/DownloadFormPage').then((m) => ({
    default: m.DownloadFormPage,
  })),
)
const FaqsListPage = lazy(() =>
  import('@/pages/dashboard/faqs/FaqsListPage').then((m) => ({
    default: m.FaqsListPage,
  })),
)
const FaqFormPage = lazy(() =>
  import('@/pages/dashboard/faqs/FaqFormPage').then((m) => ({
    default: m.FaqFormPage,
  })),
)
const ExtracurricularsListPage = lazy(() =>
  import('@/pages/dashboard/extracurriculars/ExtracurricularsListPage').then((m) => ({
    default: m.ExtracurricularsListPage,
  })),
)
const ExtracurricularFormPage = lazy(() =>
  import('@/pages/dashboard/extracurriculars/ExtracurricularFormPage').then((m) => ({
    default: m.ExtracurricularFormPage,
  })),
)
const PpdbListPage = lazy(() =>
  import('@/pages/dashboard/ppdb/PpdbListPage').then((m) => ({
    default: m.PpdbListPage,
  })),
)
const NewsletterSubscribersPage = lazy(() =>
  import('@/pages/dashboard/newsletter/NewsletterSubscribersPage').then((m) => ({
    default: m.NewsletterSubscribersPage,
  })),
)
const ActivityLogsPage = lazy(() =>
  import('@/pages/dashboard/audit/ActivityLogsPage').then((m) => ({
    default: m.ActivityLogsPage,
  })),
)
const AnalyticsPage = lazy(() =>
  import('@/pages/dashboard/analytics/AnalyticsPage').then((m) => ({
    default: m.AnalyticsPage,
  })),
)
const BackupPage = lazy(() =>
  import('@/pages/dashboard/system/BackupPage').then((m) => ({
    default: m.BackupPage,
  })),
)
const WebhooksListPage = lazy(() =>
  import('@/pages/dashboard/system/WebhooksListPage').then((m) => ({
    default: m.WebhooksListPage,
  })),
)
const WebhookFormPage = lazy(() =>
  import('@/pages/dashboard/system/WebhookFormPage').then((m) => ({
    default: m.WebhookFormPage,
  })),
)
const ApiTokensListPage = lazy(() =>
  import('@/pages/dashboard/system/ApiTokensListPage').then((m) => ({
    default: m.ApiTokensListPage,
  })),
)
const ApiTokenFormPage = lazy(() =>
  import('@/pages/dashboard/system/ApiTokenFormPage').then((m) => ({
    default: m.ApiTokenFormPage,
  })),
)
const TenantsListPage = lazy(() =>
  import('@/pages/dashboard/system/TenantsListPage').then((m) => ({
    default: m.TenantsListPage,
  })),
)
const TenantFormPage = lazy(() =>
  import('@/pages/dashboard/system/TenantFormPage').then((m) => ({
    default: m.TenantFormPage,
  })),
)
const CustomPagePublicPage = lazy(() =>
  import('@/pages/landing/CustomPagePublicPage').then((m) => ({
    default: m.CustomPagePublicPage,
  })),
)
const FaqPublicPage = lazy(() =>
  import('@/pages/landing/FaqPublicPage').then((m) => ({
    default: m.FaqPublicPage,
  })),
)
const DownloadsPublicPage = lazy(() =>
  import('@/pages/landing/DownloadsPublicPage').then((m) => ({
    default: m.DownloadsPublicPage,
  })),
)
const AcademicCalendarPublicPage = lazy(() =>
  import('@/pages/landing/AcademicCalendarPublicPage').then((m) => ({
    default: m.AcademicCalendarPublicPage,
  })),
)
const ExtracurricularsListPublicPage = lazy(() =>
  import('@/pages/landing/ExtracurricularsListPublicPage').then((m) => ({
    default: m.ExtracurricularsListPublicPage,
  })),
)
const ExtracurricularDetailPage = lazy(() =>
  import('@/pages/landing/ExtracurricularDetailPage').then((m) => ({
    default: m.ExtracurricularDetailPage,
  })),
)
const PpdbPublicPage = lazy(() =>
  import('@/pages/landing/PpdbPublicPage').then((m) => ({
    default: m.PpdbPublicPage,
  })),
)
const PreviewPage = lazy(() =>
  import('@/pages/landing/PreviewPage').then((m) => ({
    default: m.PreviewPage,
  })),
)

function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <LandingPage />
          </LazyPage>
        ),
      },
      {
        path: 'berita',
        element: (
          <LazyPage>
            <NewsListPublicPage />
          </LazyPage>
        ),
      },
      {
        path: 'berita/:slug',
        element: (
          <LazyPage>
            <NewsDetailPage />
          </LazyPage>
        ),
      },
      {
        path: 'agenda',
        element: (
          <LazyPage>
            <AgendaListPublicPage />
          </LazyPage>
        ),
      },
      {
        path: 'agenda/:slug',
        element: (
          <LazyPage>
            <AgendaDetailPage />
          </LazyPage>
        ),
      },
      {
        path: 'visi-misi',
        element: (
          <LazyPage>
            <VisionMissionPublicPage />
          </LazyPage>
        ),
      },
      {
        path: 'guru',
        element: (
          <LazyPage>
            <TeachersListPublicPage />
          </LazyPage>
        ),
      },
      {
        path: 'guru/:slug',
        element: (
          <LazyPage>
            <TeacherDetailPage />
          </LazyPage>
        ),
      },
      {
        path: 'kegiatan',
        element: (
          <LazyPage>
            <ActivitiesListPublicPage />
          </LazyPage>
        ),
      },
      {
        path: 'kegiatan/:slug',
        element: (
          <LazyPage>
            <ActivityDetailPage />
          </LazyPage>
        ),
      },
      {
        path: 'galeri',
        element: (
          <LazyPage>
            <GalleryListPublicPage />
          </LazyPage>
        ),
      },
      {
        path: 'galeri/:slug',
        element: (
          <LazyPage>
            <GalleryDetailPage />
          </LazyPage>
        ),
      },
      {
        path: 'fasilitas',
        element: (
          <LazyPage>
            <FacilitiesListPublicPage />
          </LazyPage>
        ),
      },
      {
        path: 'fasilitas/:slug',
        element: (
          <LazyPage>
            <FacilityDetailPage />
          </LazyPage>
        ),
      },
      {
        path: 'testimoni',
        element: (
          <LazyPage>
            <TestimonialsListPublicPage />
          </LazyPage>
        ),
      },
      {
        path: 'prestasi',
        element: (
          <LazyPage>
            <AchievementsListPublicPage />
          </LazyPage>
        ),
      },
      {
        path: 'prestasi/:slug',
        element: (
          <LazyPage>
            <AchievementDetailPage />
          </LazyPage>
        ),
      },
      {
        path: 'halaman/:slug',
        element: (
          <LazyPage>
            <CustomPagePublicPage />
          </LazyPage>
        ),
      },
      {
        path: 'faq',
        element: (
          <LazyPage>
            <FaqPublicPage />
          </LazyPage>
        ),
      },
      {
        path: 'unduhan',
        element: (
          <LazyPage>
            <DownloadsPublicPage />
          </LazyPage>
        ),
      },
      {
        path: 'kalender-akademik',
        element: (
          <LazyPage>
            <AcademicCalendarPublicPage />
          </LazyPage>
        ),
      },
      {
        path: 'ekstrakurikuler',
        element: (
          <LazyPage>
            <ExtracurricularsListPublicPage />
          </LazyPage>
        ),
      },
      {
        path: 'ekstrakurikuler/:slug',
        element: (
          <LazyPage>
            <ExtracurricularDetailPage />
          </LazyPage>
        ),
      },
      {
        path: 'ppdb',
        element: (
          <LazyPage>
            <PpdbPublicPage />
          </LazyPage>
        ),
      },
      {
        path: 'preview/:token',
        element: (
          <LazyPage>
            <PreviewPage />
          </LazyPage>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <LoginPage />
          </LazyPage>
        ),
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <DashboardPage />
          </LazyPage>
        ),
      },
      {
        path: 'teachers',
        element: (
          <LazyPage>
            <TeachersListPage />
          </LazyPage>
        ),
      },
      {
        path: 'teachers/new',
        element: (
          <LazyPage>
            <TeacherFormPage />
          </LazyPage>
        ),
      },
      {
        path: 'teachers/:id/edit',
        element: (
          <LazyPage>
            <TeacherFormPage />
          </LazyPage>
        ),
      },
      {
        path: 'agenda',
        element: (
          <LazyPage>
            <AgendaListPage />
          </LazyPage>
        ),
      },
      {
        path: 'agenda/new',
        element: (
          <LazyPage>
            <AgendaFormPage />
          </LazyPage>
        ),
      },
      {
        path: 'agenda/:id/edit',
        element: (
          <LazyPage>
            <AgendaFormPage />
          </LazyPage>
        ),
      },
      {
        path: 'gallery',
        element: (
          <LazyPage>
            <GalleryListPage />
          </LazyPage>
        ),
      },
      {
        path: 'gallery/new',
        element: (
          <LazyPage>
            <GalleryFormPage />
          </LazyPage>
        ),
      },
      {
        path: 'gallery/:id/edit',
        element: (
          <LazyPage>
            <GalleryFormPage />
          </LazyPage>
        ),
      },
      {
        path: 'testimonials',
        element: (
          <LazyPage>
            <TestimonialsListPage />
          </LazyPage>
        ),
      },
      {
        path: 'testimonials/new',
        element: (
          <LazyPage>
            <TestimonialFormPage />
          </LazyPage>
        ),
      },
      {
        path: 'testimonials/:id/edit',
        element: (
          <LazyPage>
            <TestimonialFormPage />
          </LazyPage>
        ),
      },
      {
        path: 'activities',
        element: (
          <LazyPage>
            <ActivitiesListPage />
          </LazyPage>
        ),
      },
      {
        path: 'activities/new',
        element: (
          <LazyPage>
            <ActivityFormPage />
          </LazyPage>
        ),
      },
      {
        path: 'activities/:id/edit',
        element: (
          <LazyPage>
            <ActivityFormPage />
          </LazyPage>
        ),
      },
      {
        path: 'facilities',
        element: (
          <LazyPage>
            <FacilitiesListPage />
          </LazyPage>
        ),
      },
      {
        path: 'facilities/new',
        element: (
          <LazyPage>
            <FacilityFormPage />
          </LazyPage>
        ),
      },
      {
        path: 'facilities/:id/edit',
        element: (
          <LazyPage>
            <FacilityFormPage />
          </LazyPage>
        ),
      },
      {
        path: 'achievements',
        element: (
          <LazyPage>
            <AchievementsListPage />
          </LazyPage>
        ),
      },
      {
        path: 'achievements/new',
        element: (
          <LazyPage>
            <AchievementFormPage />
          </LazyPage>
        ),
      },
      {
        path: 'achievements/:id/edit',
        element: (
          <LazyPage>
            <AchievementFormPage />
          </LazyPage>
        ),
      },
      {
        path: 'news',
        element: (
          <LazyPage>
            <NewsListPage />
          </LazyPage>
        ),
      },
      {
        path: 'news/new',
        element: (
          <LazyPage>
            <NewsFormPage />
          </LazyPage>
        ),
      },
      {
        path: 'news/:id/edit',
        element: (
          <LazyPage>
            <NewsFormPage />
          </LazyPage>
        ),
      },
      {
        path: 'users',
        element: (
          <PermissionRoute permissions={['users.view']}>
            <LazyPage>
              <UsersListPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'users/new',
        element: (
          <PermissionRoute permissions={['users.create']}>
            <LazyPage>
              <UserFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'users/:id/edit',
        element: (
          <PermissionRoute permissions={['users.update']}>
            <LazyPage>
              <UserFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'roles',
        element: (
          <PermissionRoute permissions={['roles.view']}>
            <LazyPage>
              <RolesListPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'roles/new',
        element: (
          <PermissionRoute permissions={['roles.create']}>
            <LazyPage>
              <RoleFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'roles/:id/edit',
        element: (
          <PermissionRoute permissions={['roles.update']}>
            <LazyPage>
              <RoleFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'contacts',
        element: (
          <PermissionRoute permissions={['contact.view']}>
            <LazyPage>
              <ContactsListPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <LazyPage>
            <ProfilePage />
          </LazyPage>
        ),
      },
      {
        path: 'media',
        element: (
          <LazyPage>
            <MediaManagerPage />
          </LazyPage>
        ),
      },
      {
        path: 'settings/general',
        element: (
          <LazyPage>
            <GeneralSettingsPage />
          </LazyPage>
        ),
      },
      {
        path: 'settings/hero',
        element: (
          <LazyPage>
            <HeroSettingsPage />
          </LazyPage>
        ),
      },
      {
        path: 'settings/about',
        element: (
          <LazyPage>
            <AboutSettingsPage />
          </LazyPage>
        ),
      },
      {
        path: 'settings/vision-mission',
        element: (
          <LazyPage>
            <VisionMissionSettingsPage />
          </LazyPage>
        ),
      },
      {
        path: 'settings/principal',
        element: (
          <LazyPage>
            <PrincipalSettingsPage />
          </LazyPage>
        ),
      },
      {
        path: 'settings/contact',
        element: (
          <LazyPage>
            <ContactSettingsPage />
          </LazyPage>
        ),
      },
      {
        path: 'settings/seo',
        element: (
          <LazyPage>
            <SeoSettingsPage />
          </LazyPage>
        ),
      },
      {
        path: 'settings/navigation',
        element: (
          <LazyPage>
            <NavigationSettingsPage />
          </LazyPage>
        ),
      },
      {
        path: 'settings/footer',
        element: (
          <LazyPage>
            <FooterSettingsPage />
          </LazyPage>
        ),
      },
      {
        path: 'settings/social',
        element: (
          <LazyPage>
            <SocialSettingsPage />
          </LazyPage>
        ),
      },
      {
        path: 'custom-pages',
        element: (
          <PermissionRoute permissions={['pages.view']}>
            <LazyPage>
              <CustomPagesListPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'custom-pages/new',
        element: (
          <PermissionRoute permissions={['pages.create']}>
            <LazyPage>
              <CustomPageFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'custom-pages/:id/edit',
        element: (
          <PermissionRoute permissions={['pages.update']}>
            <LazyPage>
              <CustomPageFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'academic-events',
        element: (
          <PermissionRoute permissions={['academic_events.view']}>
            <LazyPage>
              <AcademicEventsListPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'academic-events/new',
        element: (
          <PermissionRoute permissions={['academic_events.create']}>
            <LazyPage>
              <AcademicEventFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'academic-events/:id/edit',
        element: (
          <PermissionRoute permissions={['academic_events.update']}>
            <LazyPage>
              <AcademicEventFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'downloads',
        element: (
          <PermissionRoute permissions={['downloads.view']}>
            <LazyPage>
              <DownloadsListPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'downloads/new',
        element: (
          <PermissionRoute permissions={['downloads.create']}>
            <LazyPage>
              <DownloadFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'downloads/:id/edit',
        element: (
          <PermissionRoute permissions={['downloads.update']}>
            <LazyPage>
              <DownloadFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'faqs',
        element: (
          <PermissionRoute permissions={['faqs.view']}>
            <LazyPage>
              <FaqsListPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'faqs/new',
        element: (
          <PermissionRoute permissions={['faqs.create']}>
            <LazyPage>
              <FaqFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'faqs/:id/edit',
        element: (
          <PermissionRoute permissions={['faqs.update']}>
            <LazyPage>
              <FaqFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'extracurriculars',
        element: (
          <PermissionRoute permissions={['extracurriculars.view']}>
            <LazyPage>
              <ExtracurricularsListPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'extracurriculars/new',
        element: (
          <PermissionRoute permissions={['extracurriculars.create']}>
            <LazyPage>
              <ExtracurricularFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'extracurriculars/:id/edit',
        element: (
          <PermissionRoute permissions={['extracurriculars.update']}>
            <LazyPage>
              <ExtracurricularFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'ppdb',
        element: (
          <PermissionRoute permissions={['ppdb.view']}>
            <LazyPage>
              <PpdbListPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'newsletter',
        element: (
          <PermissionRoute permissions={['newsletter.view']}>
            <LazyPage>
              <NewsletterSubscribersPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'audit',
        element: (
          <PermissionRoute permissions={['audit.view']}>
            <LazyPage>
              <ActivityLogsPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'analytics',
        element: (
          <PermissionRoute permissions={['analytics.view']}>
            <LazyPage>
              <AnalyticsPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'backup',
        element: (
          <PermissionRoute permissions={['backup.view']}>
            <LazyPage>
              <BackupPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'webhooks',
        element: (
          <PermissionRoute permissions={['webhooks.view']}>
            <LazyPage>
              <WebhooksListPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'webhooks/new',
        element: (
          <PermissionRoute permissions={['webhooks.create']}>
            <LazyPage>
              <WebhookFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'webhooks/:id/edit',
        element: (
          <PermissionRoute permissions={['webhooks.update']}>
            <LazyPage>
              <WebhookFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'api-tokens',
        element: (
          <PermissionRoute permissions={['api_tokens.view']}>
            <LazyPage>
              <ApiTokensListPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'api-tokens/new',
        element: (
          <PermissionRoute permissions={['api_tokens.create']}>
            <LazyPage>
              <ApiTokenFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'api-tokens/:id/edit',
        element: (
          <PermissionRoute permissions={['api_tokens.update']}>
            <LazyPage>
              <ApiTokenFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'tenants',
        element: (
          <PermissionRoute permissions={['tenants.view']}>
            <LazyPage>
              <TenantsListPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'tenants/new',
        element: (
          <PermissionRoute permissions={['tenants.create']}>
            <LazyPage>
              <TenantFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
      {
        path: 'tenants/:id/edit',
        element: (
          <PermissionRoute permissions={['tenants.update']}>
            <LazyPage>
              <TenantFormPage />
            </LazyPage>
          </PermissionRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
