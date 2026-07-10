import { SEOHead } from '@/components/common/SEOHead'
import { useLandingContext } from '@/features/landing/LandingDataContext'
import { AboutSection } from '@/pages/landing/sections/AboutSection'
import { AcademicCalendarSection } from '@/pages/landing/sections/AcademicCalendarSection'
import { AchievementsSection } from '@/pages/landing/sections/AchievementsSection'
import { ActivitiesSection } from '@/pages/landing/sections/ActivitiesSection'
import { AgendaSection } from '@/pages/landing/sections/AgendaSection'
import { ContactSection } from '@/pages/landing/sections/ContactSection'
import { ExtracurricularSection } from '@/pages/landing/sections/ExtracurricularSection'
import { FacilitiesSection } from '@/pages/landing/sections/FacilitiesSection'
import { FaqSection } from '@/pages/landing/sections/FaqSection'
import { GallerySection } from '@/pages/landing/sections/GallerySection'
import { HeroSection } from '@/pages/landing/sections/HeroSection'
import { NewsSection } from '@/pages/landing/sections/NewsSection'
import { PrincipalSection } from '@/pages/landing/sections/PrincipalSection'
import { TeachersSection } from '@/pages/landing/sections/TeachersSection'
import { TestimonialsSection } from '@/pages/landing/sections/TestimonialsSection'
import { VisionMissionSection } from '@/pages/landing/sections/VisionMissionSection'

export function LandingPage() {
  const { data, settings } = useLandingContext()
  const seo = data?.seo

  return (
    <>
      <SEOHead
        description={seo?.description ? String(seo.description) : settings.schoolTagline}
        ogTitle={seo?.title ? String(seo.title) : undefined}
        keywords={
          seo?.keywords
            ? String(seo.keywords)
                .split(',')
                .map((k) => k.trim())
                .filter(Boolean)
            : undefined
        }
        ogImage={seo?.og_image ? String(seo.og_image) : undefined}
      />
      <HeroSection />
      <AboutSection />
      <VisionMissionSection />
      <PrincipalSection />
      <TeachersSection />
      <ActivitiesSection />
      <AgendaSection />
      <GallerySection />
      <TestimonialsSection />
      <FacilitiesSection />
      <AchievementsSection />
      <NewsSection />
      <FaqSection />
      <ExtracurricularSection />
      <AcademicCalendarSection />
      <ContactSection />
    </>
  )
}
