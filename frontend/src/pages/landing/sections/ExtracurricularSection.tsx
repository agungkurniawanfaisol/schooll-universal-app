import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { CardContent } from '@/components/ui/card'
import { LandingSection } from '@/features/landing/LandingSection'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { SectionCarousel } from '@/features/landing/SectionCarousel'
import { SectionHeader } from '@/features/landing/SectionHeader'
import { SectionReadMoreLink } from '@/features/landing/SectionReadMoreLink'
import { useLandingContext } from '@/features/landing/LandingDataContext'

export function ExtracurricularSection() {
  const { data } = useLandingContext()
  const items = (data as { extracurriculars?: unknown[] } | undefined)?.extracurriculars ?? []

  if (!items.length) return null

  return (
    <LandingSection id="ekstrakurikuler" variant="muted">
      <SectionHeader
        eyebrow="Ekstrakurikuler"
        title="Kegiatan Ekstrakurikuler"
        description="Pengembangan bakat dan minat di luar jam pelajaran."
      />

      <SectionCarousel ariaLabel="Carousel ekstrakurikuler">
        {items.map((item) => {
          const extra = item as Record<string, unknown>
          return (
            <Link
              key={String(extra.id)}
              to={`/ekstrakurikuler/${String(extra.slug)}`}
              className="group block h-full"
            >
              <PremiumCard className="h-full">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-primary/10">
                    {extra.image || extra.image_url ? (
                      <img
                        src={String(extra.image ?? extra.image_url)}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <Sparkles className="h-7 w-7 text-primary" />
                    )}
                  </div>
                  <h3 className="line-clamp-2 font-semibold group-hover:text-primary">
                    {String(extra.title)}
                  </h3>
                  {extra.schedule ? (
                    <p className="mt-1 text-xs text-muted-foreground">{String(extra.schedule)}</p>
                  ) : null}
                </CardContent>
              </PremiumCard>
            </Link>
          )
        })}
      </SectionCarousel>

      <SectionReadMoreLink to="/ekstrakurikuler" label="Lihat semua ekstrakurikuler" />
    </LandingSection>
  )
}
