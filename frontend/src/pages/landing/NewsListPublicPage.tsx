import { Calendar } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { DateRangeFilter } from '@/components/common/DateRangeFilter'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PaginationControls } from '@/components/common/PaginationControls'
import { PublicPageHeader } from '@/components/layout/PublicPageHeader'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { Badge } from '@/components/ui/badge'
import { CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { formatDate } from '@/api/utils'
import { usePublicNewsList } from '@/hooks/usePublicContent'

export function NewsListPublicPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const { data, isLoading } = usePublicNewsList({
    page,
    perPage: 9,
    search: search || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  })

  const items = data?.items ?? []
  const totalPages = data?.meta.totalPages ?? 1

  return (
    <PublicPageShell
      title="Berita Sekolah"
      description="Informasi dan pengumuman resmi sekolah"
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <PublicPageHeader
          eyebrow="Berita"
          title="Informasi Terkini"
          description="Kabar, pengumuman, dan artikel dari sekolah."
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Input
            placeholder="Cari berita..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="max-w-sm"
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
        </div>

        {isLoading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">Belum ada berita untuk filter ini.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link key={String(item.id)} to={`/berita/${String(item.slug)}`} className="block h-full">
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
                  <CardContent className="p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="secondary">Berita</Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.publish_start_at ?? item.published_at ?? item.created_at)}
                      </span>
                    </div>
                    <h2 className="line-clamp-2 font-semibold group-hover:text-primary">{String(item.title)}</h2>
                    {item.excerpt ? (
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{String(item.excerpt)}</p>
                    ) : null}
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
