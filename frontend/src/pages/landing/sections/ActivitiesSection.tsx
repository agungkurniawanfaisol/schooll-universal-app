import { motion } from 'framer-motion'
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
import { springSoft, viewportOnce } from '@/lib/motion'

export function ActivitiesSection() {
  const { data } = useLandingContext()
  const activities = data?.activities ?? []

  if (!activities.length) return null

  return (
    <LandingSection id="kegiatan" variant="default">
      <SectionHeader
        eyebrow="Kegiatan"
        title="Aktivitas & Program Sekolah"
        description="Pengalaman belajar yang kaya melalui kegiatan akademik dan non-akademik."
      />

      <SectionCarousel ariaLabel="Carousel kegiatan sekolah">
        {activities.map((activity) => (
          <Link key={String(activity.id)} to={`/kegiatan/${String(activity.slug)}`} className="group block h-full">
            <PremiumCard className="h-full overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden gradient-surface">
                {activity.image ? (
                  <img
                    src={String(activity.image)}
                    alt={String(activity.title)}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <CardContent className="space-y-3 p-6">
                <Badge variant="secondary">Kegiatan</Badge>
                <h3 className="line-clamp-2 break-words text-lg font-semibold transition-colors duration-300 group-hover:text-primary">
                  {String(activity.title)}
                </h3>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(activity.date)}
                </p>
                {activity.description ? (
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {String(activity.description)}
                  </p>
                ) : null}
              </CardContent>
            </PremiumCard>
          </Link>
        ))}
      </SectionCarousel>

      <div className="mt-12 hidden gap-6 md:grid md:grid-cols-2">
        {activities.slice(0, 4).map((activity, i) => (
          <motion.div
            key={String(activity.id)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ ...springSoft, delay: i * 0.06 }}
          >
            <Link to={`/kegiatan/${String(activity.slug)}`} className="group block">
              <PremiumCard>
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/15">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold transition-colors duration-300 group-hover:text-primary">
                      {String(activity.title)}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{formatDate(activity.date)}</p>
                  </div>
                </CardContent>
              </PremiumCard>
            </Link>
          </motion.div>
        ))}
      </div>

      <SectionReadMoreLink to="/kegiatan" label="Lihat semua kegiatan" />
    </LandingSection>
  )
}
