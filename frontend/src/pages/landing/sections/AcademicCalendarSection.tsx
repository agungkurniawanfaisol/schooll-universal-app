import { Calendar } from 'lucide-react'

import { formatDate } from '@/api/utils'
import { Badge } from '@/components/ui/badge'
import { CardContent } from '@/components/ui/card'
import { LandingSection } from '@/features/landing/LandingSection'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { SectionHeader } from '@/features/landing/SectionHeader'
import { SectionReadMoreLink } from '@/features/landing/SectionReadMoreLink'
import { useLandingContext } from '@/features/landing/LandingDataContext'

export function AcademicCalendarSection() {
  const { data } = useLandingContext()
  const events = (data as { academic_events?: unknown[] } | undefined)?.academic_events ?? []

  if (!events.length) return null

  return (
    <LandingSection id="kalender-akademik" variant="default">
      <SectionHeader
        eyebrow="Kalender Akademik"
        title="Jadwal Akademik"
        description="Kegiatan penting dan jadwal sekolah."
      />

      <div className="mx-auto max-w-3xl space-y-4">
        {events.slice(0, 5).map((item) => {
          const event = item as Record<string, unknown>
          return (
            <PremiumCard key={String(event.id)} hover={false}>
              <CardContent className="flex gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{String(event.title)}</h3>
                    {event.event_type ? (
                      <Badge variant="secondary">{String(event.event_type)}</Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDate(String(event.start_date))}
                  </p>
                </div>
              </CardContent>
            </PremiumCard>
          )
        })}
      </div>

      <SectionReadMoreLink to="/kalender-akademik" label="Lihat kalender lengkap" />
    </LandingSection>
  )
}
