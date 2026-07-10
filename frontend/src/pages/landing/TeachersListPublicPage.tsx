import { useState } from 'react'
import { Link } from 'react-router-dom'

import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PaginationControls } from '@/components/common/PaginationControls'
import { PublicPageHeader } from '@/components/layout/PublicPageHeader'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { usePublicTeachersList } from '@/hooks/usePublicContent'

export function TeachersListPublicPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading } = usePublicTeachersList({
    page,
    perPage: 9,
    search: search || undefined,
  })

  const items = data?.items ?? []
  const totalPages = data?.meta.totalPages ?? 1

  return (
    <PublicPageShell backTo="/" backLabel="Kembali ke Beranda" title="Guru" description="Tenaga pendidik profesional sekolah">
      <div className="mx-auto max-w-6xl space-y-8">
        <PublicPageHeader
          eyebrow="Akademik"
          title="Guru & Tenaga Pendidik"
          description="Tim pengajar berdedikasi yang membimbing siswa."
        />

        <Input
          placeholder="Cari guru..."
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
          <p className="text-center text-muted-foreground">Belum ada data guru.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((teacher) => (
              <Link key={String(teacher.id)} to={`/guru/${String(teacher.slug)}`} className="block h-full">
                <PremiumCard className="h-full overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <Avatar className="mx-auto mb-4 h-20 w-20 ring-2 ring-primary/10 group-hover:ring-primary/30">
                      {teacher.photo ? (
                        <AvatarImage src={String(teacher.photo)} alt={String(teacher.name)} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                          {String(teacher.name).charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <h2 className="font-semibold group-hover:text-primary">{String(teacher.name)}</h2>
                    <p className="text-sm text-primary">{String(teacher.position ?? teacher.subject ?? '')}</p>
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
