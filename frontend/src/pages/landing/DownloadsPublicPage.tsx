import { Download, FileText } from 'lucide-react'
import { useState } from 'react'

import { endpoints } from '@/api/endpoints'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PaginationControls } from '@/components/common/PaginationControls'
import { PublicPageHeader } from '@/components/layout/PublicPageHeader'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { usePublicDownloadsList } from '@/hooks/usePublicContent'

export function DownloadsPublicPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading } = usePublicDownloadsList({
    page,
    perPage: 12,
    search: search || undefined,
  })

  const items = data?.items ?? []
  const totalPages = data?.meta.totalPages ?? 1

  return (
    <PublicPageShell backTo="/" backLabel="Kembali ke Beranda" title="Unduhan" description="Dokumen dan formulir unduhan">
      <div className="mx-auto max-w-4xl space-y-8">
        <PublicPageHeader
          eyebrow="Unduhan"
          title="Dokumen Unduhan"
          description="Formulir, brosur, dan dokumen resmi sekolah."
        />

        <Input
          placeholder="Cari dokumen..."
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
          <p className="text-center text-muted-foreground">Belum ada dokumen.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <PremiumCard key={String(item.id)} hover={false}>
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-semibold">{String(item.title)}</h2>
                      {item.description ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {String(item.description)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <Button variant="gradient" asChild>
                    <a
                      href={endpoints.public.downloadFile(String(item.slug))}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4" />
                      Unduh
                    </a>
                  </Button>
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
