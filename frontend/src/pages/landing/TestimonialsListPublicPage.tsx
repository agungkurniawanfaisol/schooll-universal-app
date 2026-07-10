import { Star } from 'lucide-react'
import { useState } from 'react'

import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PaginationControls } from '@/components/common/PaginationControls'
import { PublicPageHeader } from '@/components/layout/PublicPageHeader'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { usePublicTestimonialsList } from '@/hooks/usePublicContent'

export function TestimonialsListPublicPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading } = usePublicTestimonialsList({
    page,
    perPage: 9,
    search: search || undefined,
  })

  const items = data?.items ?? []
  const totalPages = data?.meta.totalPages ?? 1

  return (
    <PublicPageShell title="Testimoni" description="Apa kata orang tua, alumni, dan mitra">
      <div className="mx-auto max-w-4xl space-y-8">
        <PublicPageHeader
          eyebrow="Testimoni"
          title="Apa Kata Mereka"
          description="Kepercayaan komunitas sekolah kami."
        />

        <Input
          placeholder="Cari testimoni..."
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
          <p className="text-center text-muted-foreground">Belum ada testimoni.</p>
        ) : (
          <div className="space-y-6">
            {items.map((item) => {
              const rating = Number(item.rating ?? 5)
              return (
                <PremiumCard key={String(item.id)} hover={false}>
                  <CardContent className="space-y-4 p-6 md:p-8">
                    <div className="flex justify-center gap-1 md:justify-start">
                      {Array.from({ length: rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                      ))}
                    </div>
                    <blockquote className="text-lg leading-relaxed">&ldquo;{String(item.comment)}&rdquo;</blockquote>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        {item.photo ? (
                          <AvatarImage src={String(item.photo)} alt={String(item.name)} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {String(item.name).charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-semibold">{String(item.name)}</p>
                        {item.occupation ? (
                          <p className="text-sm text-muted-foreground">{String(item.occupation)}</p>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </PremiumCard>
              )
            })}
          </div>
        )}

        <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </PublicPageShell>
  )
}
