import { motion } from 'framer-motion'
import { Clock, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { CardContent } from '@/components/ui/card'
import { formatDate } from '@/api/utils'
import { LandingSection } from '@/features/landing/LandingSection'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { SectionHeader } from '@/features/landing/SectionHeader'
import { SectionReadMoreLink } from '@/features/landing/SectionReadMoreLink'
import { useLandingContext } from '@/features/landing/LandingDataContext'
import { fadeInLeft, springSoft, viewportOnce } from '@/lib/motion'

export function AgendaSection() {
  const { data } = useLandingContext()
  const agendaItems = data?.agendas ?? []

  if (!agendaItems.length) return null

  return (
    <LandingSection id="agenda" variant="spotlight">
      <SectionHeader
        eyebrow="Agenda"
        title="Jadwal & Acara Mendatang"
        description="Ikuti kegiatan dan acara penting yang akan datang di sekolah kami."
      />

      <div className="mx-auto max-w-3xl space-y-4">
        {agendaItems.map((item, i) => (
          <motion.div
            key={String(item.id)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInLeft}
            transition={{ ...springSoft, delay: i * 0.08 }}
          >
            <Link to={`/agenda/${String(item.slug)}`} className="group block">
              <PremiumCard>
                <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">Agenda</Badge>
                      <span className="text-sm text-muted-foreground">{formatDate(item.date)}</span>
                      {item.time ? (
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {String(item.time).slice(0, 5)}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="break-words font-semibold transition-colors duration-300 group-hover:text-primary">
                      {String(item.title)}
                    </h3>
                    {item.location ? (
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {String(item.location)}
                      </p>
                    ) : null}
                    {item.description ? (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{String(item.description)}</p>
                    ) : null}
                  </div>
                </CardContent>
              </PremiumCard>
            </Link>
          </motion.div>
        ))}
      </div>

      <SectionReadMoreLink to="/agenda" label="Lihat semua agenda" />
    </LandingSection>
  )
}
