import { Calendar } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PaginationControls } from '@/components/common/PaginationControls'
import { PublicPageHeader } from '@/components/layout/PublicPageHeader'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { Badge } from '@/components/ui/badge'
import { CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { formatDate } from '@/api/utils'
import { usePublicActivitiesList } from '@/hooks/usePublicContent'

export function ActivitiesListPublicPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading } = usePublicActivitiesList({
    page,
    perPage: 9,
    search: search || undefined,
  })

  const items = data?.items ?? []
  const totalPages = data?.meta.totalPages ?? 1

  return (
    <PublicPageShell backTo="/" backLabel="Kembali ke Beranda" title="Kegiatan" description="Aktivitas dan program sekolah">
      <div className="mx-auto max-w-6xl space-y-8">
        <PublicPageHeader
          eyebrow="Akademik"
          title="Kegiatan Sekolah"
          description="Pengalaman belajar akademik dan non-akademik."
        />

        <Input
          placeholder="Cari kegiatan..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="max-w-sm"
        />

        {isLoading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">Belum ada kegiatan.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link key={String(item.id)} to={`/kegiatan/${String(item.slug)}`} className="block h-full">
                <PremiumCard className="h-full overflow-hidden">
                  <div className="aspect-[16/10] overflow-hidden gradient-surface">
                    {item.image ? (
                      <img
                        src={String(item.image)}
                        alt={String(item.title)}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <CardContent className="space-y-2 p-5">
                    <Badge variant="secondary">Kegiatan</Badge>
                    <h2 className="line-clamp-2 font-semibold group-hover:text-primary">{String(item.title)}</h2>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(item.date)}
                    </p>
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
