import { Calendar, Clock, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { DateRangeFilter } from '@/components/common/DateRangeFilter'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PaginationControls } from '@/components/common/PaginationControls'
import { PublicPageHeader } from '@/components/layout/PublicPageHeader'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { Badge } from '@/components/ui/badge'
import { CardContent } from '@/components/ui/card'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { formatDate } from '@/api/utils'
import { usePublicAgendaList } from '@/hooks/usePublicContent'

export function AgendaListPublicPage() {
  const [page, setPage] = useState(1)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const { data, isLoading } = usePublicAgendaList({
    page,
    perPage: 9,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  })

  const items = data?.items ?? []
  const totalPages = data?.meta.totalPages ?? 1

  return (
    <PublicPageShell title="Agenda Sekolah" description="Jadwal dan acara sekolah">
      <div className="mx-auto max-w-4xl space-y-8">
        <PublicPageHeader
          eyebrow="Agenda"
          title="Jadwal & Acara"
          description="Kegiatan dan jadwal resmi sekolah."
        />

        <DateRangeFilter
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={(value) => {
            setDateFrom(value)
            setPage(1)
          }}
          onDateToChange={(value) => {
            setDateTo(value)
            setPage(1)
          }}
          onClear={() => {
            setDateFrom('')
            setDateTo('')
            setPage(1)
          }}
        />

        {isLoading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">Belum ada agenda untuk filter ini.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Link key={String(item.id)} to={`/agenda/${String(item.slug)}`} className="block">
                <PremiumCard>
                  <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">Agenda</Badge>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(item.date)}
                        </span>
                        {item.time ? (
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {String(item.time).slice(0, 5)}
                          </span>
                        ) : null}
                      </div>
                      <h2 className="font-semibold">{String(item.title)}</h2>
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
            ))}
          </div>
        )}

        <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </PublicPageShell>
  )
}
