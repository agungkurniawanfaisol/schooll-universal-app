import { ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PaginationControls } from '@/components/common/PaginationControls'
import { PublicPageHeader } from '@/components/layout/PublicPageHeader'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PremiumCard } from '@/features/landing/PremiumCard'
import type { ApiRecord } from '@/api/utils'
import { usePublicGalleriesList } from '@/hooks/usePublicContent'

function galleryCover(item: ApiRecord): string | undefined {
  if (item.cover_image) return String(item.cover_image)
  const images = item.images as string[] | undefined
  return images?.[0]
}

export function GalleryListPublicPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading } = usePublicGalleriesList({
    page,
    perPage: 9,
    search: search || undefined,
  })

  const items = data?.items ?? []
  const totalPages = data?.meta.totalPages ?? 1

  return (
    <PublicPageShell title="Galeri" description="Dokumentasi kegiatan sekolah">
      <div className="mx-auto max-w-6xl space-y-8">
        <PublicPageHeader
          eyebrow="Informasi"
          title="Galeri Sekolah"
          description="Momen berharga dan dokumentasi kegiatan."
        />

        <Input
          placeholder="Cari album galeri..."
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
          <p className="text-center text-muted-foreground">Belum ada galeri.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const cover = galleryCover(item)
              return (
                <Link key={String(item.id)} to={`/galeri/${String(item.slug)}`} className="block h-full">
                  <PremiumCard className="h-full overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden gradient-surface">
                      {cover ? (
                        <img
                          src={cover}
                          alt={String(item.title)}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <h2 className="font-semibold group-hover:text-primary">{String(item.title)}</h2>
                      {item.description ? (
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{String(item.description)}</p>
                      ) : null}
                    </CardContent>
                  </PremiumCard>
                </Link>
              )
            })}
          </div>
        )}

        <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </PublicPageShell>
  )
}
