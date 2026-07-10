import { Sparkles } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { BackButton } from '@/components/common/BackButton'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { usePublicExtracurricular } from '@/hooks/usePublicContent'

export function ExtracurricularDetailPage() {
  const { slug = '' } = useParams()
  const { data: item, isLoading, isError } = usePublicExtracurricular(slug)

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !item) {
    return (
      <div className="container mx-auto px-4 py-24 text-center lg:px-8">
        <h1 className="text-2xl font-bold">Ekstrakurikuler tidak ditemukan</h1>
        <BackButton to="/ekstrakurikuler" label="Kembali ke Ekstrakurikuler" variant="gradient" className="mt-6" />
      </div>
    )
  }

  const title = String(item.title ?? 'Ekstrakurikuler')

  return (
    <PublicPageShell backTo="/ekstrakurikuler" backLabel="Kembali ke Ekstrakurikuler" title={title} description={item.description ? String(item.description) : title}>
      <article className="mx-auto max-w-3xl">
<h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>

        {item.image || item.image_url ? (
          <div className="mt-8 overflow-hidden rounded-2xl shadow-soft">
            <img
              src={String(item.image ?? item.image_url)}
              alt={title}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        ) : (
          <div className="mt-8 flex justify-center rounded-2xl bg-primary/10 p-12">
            <Sparkles className="h-16 w-16 text-primary" />
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {item.schedule ? (
            <p className="text-sm">
              <span className="font-medium">Jadwal:</span> {String(item.schedule)}
            </p>
          ) : null}
          {item.coach ? (
            <p className="text-sm">
              <span className="font-medium">Pelatih:</span> {String(item.coach)}
            </p>
          ) : null}
        </div>

        {item.description ? (
          <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
            {String(item.description)}
          </p>
        ) : null}
      </article>
    </PublicPageShell>
  )
}
