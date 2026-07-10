import { Award } from 'lucide-react'
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
import { usePublicAchievementsList } from '@/hooks/usePublicContent'

export function AchievementsListPublicPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading } = usePublicAchievementsList({
    page,
    perPage: 9,
    search: search || undefined,
  })

  const items = data?.items ?? []
  const totalPages = data?.meta.totalPages ?? 1

  return (
    <PublicPageShell title="Prestasi" description="Pencapaian gemilang sekolah">
      <div className="mx-auto max-w-6xl space-y-8">
        <PublicPageHeader
          eyebrow="Prestasi"
          title="Pencapaian Gemilang"
          description="Prestasi akademik dan non-akademik siswa."
        />

        <Input
          placeholder="Cari prestasi..."
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
          <p className="text-center text-muted-foreground">Belum ada prestasi.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <Link key={String(item.id)} to={`/prestasi/${String(item.slug)}`} className="block h-full">
                <PremiumCard className="h-full">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15">
                      <Award className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        {item.category ? <Badge variant="secondary">{String(item.category)}</Badge> : null}
                        {item.year ? <span className="text-sm text-muted-foreground">{String(item.year)}</span> : null}
                      </div>
                      <h2 className="font-semibold group-hover:text-primary">{String(item.title)}</h2>
                      {item.description ? (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{String(item.description)}</p>
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
