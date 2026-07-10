import { Skeleton } from '@/components/ui/skeleton'
import { HeroCarousel } from '@/features/landing/HeroCarousel'
import { useLandingContext } from '@/features/landing/LandingDataContext'
import type { ApiRecord } from '@/api/utils'

function HeroSkeleton() {
  return (
    <section className="relative flex min-h-dvh items-center gradient-hero-bg pt-24">
      <div className="container mx-auto space-y-6 px-4 py-20">
        <Skeleton className="h-8 w-48 bg-hero-surface-strong" />
        <Skeleton className="h-16 w-full max-w-2xl bg-hero-surface-strong" />
        <Skeleton className="h-6 w-full max-w-lg bg-hero-surface-strong" />
      </div>
    </section>
  )
}

function fallbackSlide(settings: { schoolName: string; schoolTagline: string }): ApiRecord {
  return {
    title: settings.schoolName,
    subtitle: settings.schoolTagline,
    description:
      'Membangun generasi cerdas, berkarakter, dan siap menghadapi tantangan global melalui pendidikan berkualitas.',
    cta_text: 'Pelajari Lebih Lanjut',
    cta_url: '#tentang',
  }
}

export function HeroSection() {
  const { data, settings, isLoading } = useLandingContext()

  if (isLoading) return <HeroSkeleton />

  const slides = data?.hero?.length ? data.hero : [fallbackSlide(settings)]

  return <HeroCarousel slides={slides} settings={settings} />
}
