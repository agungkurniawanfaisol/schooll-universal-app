import { Calendar } from 'lucide-react'
import { useState } from 'react'

import { formatDate } from '@/api/utils'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PaginationControls } from '@/components/common/PaginationControls'
import { PublicPageHeader } from '@/components/layout/PublicPageHeader'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { Badge } from '@/components/ui/badge'
import { CardContent } from '@/components/ui/card'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { usePublicAcademicEventsList } from '@/hooks/usePublicContent'

export function AcademicCalendarPublicPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = usePublicAcademicEventsList({ page, perPage: 20 })
  const items = data?.items ?? []
  const totalPages = data?.meta.totalPages ?? 1

  return (
    <PublicPageShell backTo="/" backLabel="Kembali ke Beranda" title="Kalender Akademik" description="Jadwal kegiatan akademik">
      <div className="mx-auto max-w-4xl space-y-8">
        <PublicPageHeader
          eyebrow="Akademik"
          title="Kalender Akademik"
          description="Jadwal kegiatan, ujian, dan libur sekolah."
        />

        {isLoading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">Belum ada jadwal.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <PremiumCard key={String(item.id)} hover={false}>
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: item.color ? `${String(item.color)}20` : undefined }}
                  >
                    <Calendar
                      className="h-6 w-6"
                      style={{ color: item.color ? String(item.color) : undefined }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{String(item.title)}</h2>
                      {item.event_type ? (
                        <Badge variant="secondary">{String(item.event_type)}</Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDate(String(item.start_date))}
                      {item.end_date && item.end_date !== item.start_date
                        ? ` — ${formatDate(String(item.end_date))}`
                        : ''}
                    </p>
                    {item.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {String(item.description)}
                      </p>
                    ) : null}
                  </div>
                </CardContent>
              </PremiumCard>
            ))}
          </div>
        )}

        <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </PublicPageShell>
  )
}
