import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PaginationControls } from '@/components/common/PaginationControls'
import { PublicPageHeader } from '@/components/layout/PublicPageHeader'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { usePublicExtracurricularsList } from '@/hooks/usePublicContent'

export function ExtracurricularsListPublicPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading } = usePublicExtracurricularsList({
    page,
    perPage: 9,
    search: search || undefined,
  })

  const items = data?.items ?? []
  const totalPages = data?.meta.totalPages ?? 1

  return (
    <PublicPageShell backTo="/" backLabel="Kembali ke Beranda" title="Ekstrakurikuler" description="Kegiatan ekstrakurikuler sekolah">
      <div className="mx-auto max-w-6xl space-y-8">
        <PublicPageHeader
          eyebrow="Ekstrakurikuler"
          title="Kegiatan Ekstrakurikuler"
          description="Wadah pengembangan bakat dan minat siswa."
        />

        <Input
          placeholder="Cari ekstrakurikuler..."
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
          <p className="text-center text-muted-foreground">Belum ada ekstrakurikuler.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link
                key={String(item.id)}
                to={`/ekstrakurikuler/${String(item.slug)}`}
                className="block h-full"
              >
                <PremiumCard className="h-full">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-primary/10">
                      {item.image || item.image_url ? (
                        <img
                          src={String(item.image ?? item.image_url)}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <Sparkles className="h-7 w-7 text-primary" />
                      )}
                    </div>
                    <h2 className="font-semibold">{String(item.title)}</h2>
                    {item.schedule ? (
                      <p className="mt-1 text-xs text-muted-foreground">{String(item.schedule)}</p>
                    ) : null}
                    {item.description ? (
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {String(item.description)}
                      </p>
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
