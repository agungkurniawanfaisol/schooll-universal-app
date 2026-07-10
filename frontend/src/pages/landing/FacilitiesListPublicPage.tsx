import { Building2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PaginationControls } from '@/components/common/PaginationControls'
import { PublicPageHeader } from '@/components/layout/PublicPageHeader'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { usePublicFacilitiesList } from '@/hooks/usePublicContent'

export function FacilitiesListPublicPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading } = usePublicFacilitiesList({
    page,
    perPage: 9,
    search: search || undefined,
  })

  const items = data?.items ?? []
  const totalPages = data?.meta.totalPages ?? 1

  return (
    <PublicPageShell title="Fasilitas" description="Sarana prasarana sekolah">
      <div className="mx-auto max-w-6xl space-y-8">
        <PublicPageHeader
          eyebrow="Fasilitas"
          title="Sarana Prasarana"
          description="Fasilitas modern untuk mendukung pembelajaran."
        />

        <Input
          placeholder="Cari fasilitas..."
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
          <p className="text-center text-muted-foreground">Belum ada fasilitas.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link key={String(item.id)} to={`/fasilitas/${String(item.slug)}`} className="block h-full">
                <PremiumCard className="h-full">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-primary/10">
                      {item.image ? (
                        <img src={String(item.image)} alt="" className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <Building2 className="h-7 w-7 text-primary" />
                      )}
                    </div>
                    <h2 className="font-semibold group-hover:text-primary">{String(item.title)}</h2>
                    {item.description ? (
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{String(item.description)}</p>
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
