import { Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { CardContent } from '@/components/ui/card'
import { LandingSection } from '@/features/landing/LandingSection'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { SectionCarousel } from '@/features/landing/SectionCarousel'
import { SectionHeader } from '@/features/landing/SectionHeader'
import { SectionReadMoreLink } from '@/features/landing/SectionReadMoreLink'
import { useLandingContext } from '@/features/landing/LandingDataContext'

export function FacilitiesSection() {
  const { data } = useLandingContext()
  const facilities = data?.facilities ?? []

  if (!facilities.length) return null

  return (
    <LandingSection id="fasilitas" variant="default">
      <SectionHeader
        eyebrow="Fasilitas"
        title="Sarana Prasarana Unggulan"
        description="Fasilitas modern untuk mendukung proses belajar mengajar yang optimal."
      />

      <SectionCarousel ariaLabel="Carousel fasilitas sekolah">
        {facilities.map((facility) => (
          <Link key={String(facility.id)} to={`/fasilitas/${String(facility.slug)}`} className="group block h-full">
            <PremiumCard className="h-full">
              <CardContent className="p-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow">
                  {facility.image ? (
                    <img src={String(facility.image)} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <Building2 className="h-7 w-7 text-primary transition-colors group-hover:text-primary-foreground" />
                  )}
                </div>
                <h3 className="line-clamp-2 break-words text-lg font-semibold transition-colors duration-300 group-hover:text-primary">
                  {String(facility.title)}
                </h3>
                {facility.description ? (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {String(facility.description)}
                  </p>
                ) : null}
              </CardContent>
            </PremiumCard>
          </Link>
        ))}
      </SectionCarousel>

      <SectionReadMoreLink to="/fasilitas" label="Lihat semua fasilitas" />
    </LandingSection>
  )
}
