import { Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { CardContent } from '@/components/ui/card'
import { formatDate } from '@/api/utils'
import { LandingSection } from '@/features/landing/LandingSection'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { SectionCarousel } from '@/features/landing/SectionCarousel'
import { SectionHeader } from '@/features/landing/SectionHeader'
import { SectionReadMoreLink } from '@/features/landing/SectionReadMoreLink'
import { useLandingContext } from '@/features/landing/LandingDataContext'

export function NewsSection() {
  const { data, settings } = useLandingContext()
  const newsItems = data?.news ?? []

  if (!newsItems.length) return null

  return (
    <LandingSection id="berita" variant="muted">
      <SectionHeader
        eyebrow="Berita"
        title="Informasi Terkini"
        description={`Kabar dan pengumuman resmi dari ${settings.schoolName}.`}
      />

      <SectionCarousel ariaLabel={`Carousel berita ${settings.schoolName}`}>
        {newsItems.map((item) => (
          <Link key={String(item.id)} to={`/berita/${String(item.slug)}`} className="group block h-full">
            <PremiumCard className="h-full overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden gradient-surface">
                {item.thumbnail ? (
                  <img
                    src={String(item.thumbnail)}
                    alt={String(item.title)}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="secondary">Berita</Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(item.publish_start_at ?? item.published_at ?? item.created_at)}
                  </span>
                </div>
                <h3 className="line-clamp-2 break-words font-semibold transition-colors duration-300 group-hover:text-primary">
                  {String(item.title)}
                </h3>
                {item.excerpt ? (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {String(item.excerpt)}
                  </p>
                ) : null}
              </CardContent>
            </PremiumCard>
          </Link>
        ))}
      </SectionCarousel>

      <SectionReadMoreLink to="/berita" label="Lihat semua berita" />
    </LandingSection>
  )
}
