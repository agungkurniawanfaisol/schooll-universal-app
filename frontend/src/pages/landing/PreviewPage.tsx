import { useParams } from 'react-router-dom'

import { BackButton } from '@/components/common/BackButton'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { sanitizeHtml } from '@/lib/sanitizeHtml'
import { usePublicPreview } from '@/hooks/usePublicContent'

export function PreviewPage() {
  const { token = '' } = useParams()
  const { data, isLoading, isError } = usePublicPreview(token)

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !data?.item) {
    return (
      <div className="container mx-auto px-4 py-24 text-center lg:px-8">
        <h1 className="text-2xl font-bold">Preview tidak ditemukan</h1>
        <p className="mt-2 text-muted-foreground">Token preview tidak valid atau sudah kedaluwarsa.</p>
        <BackButton to="/dashboard" label="Kembali ke Dashboard" variant="gradient" className="mt-6" />
      </div>
    )
  }

  const item = data.item as Record<string, unknown>
  const title = String(item.title ?? 'Preview')
  const isNews = data.type === 'news'

  return (
    <PublicPageShell backTo="/dashboard" backLabel="Kembali ke Dashboard" title={`Preview: ${title}`} description="Pratinjau konten">
      <article className="mx-auto max-w-3xl">
        <div className="mb-6 rounded-lg border border-warning/30 bg-warning/10 px-4 py-2 text-sm text-warning-foreground">
          Mode pratinjau — konten ini belum dipublikasikan.
        </div>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>

        {isNews && item.excerpt ? (
          <p className="mt-4 text-lg text-muted-foreground">{String(item.excerpt)}</p>
        ) : null}

        {item.thumbnail || item.cover_image ? (
          <div className="mt-8 overflow-hidden rounded-2xl shadow-soft">
            <img
              src={String(item.thumbnail ?? item.cover_image)}
              alt={title}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        ) : null}

        {item.content ? (
          <div
            className="prose prose-neutral mt-8 max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(String(item.content)) }}
          />
        ) : null}
      </article>
    </PublicPageShell>
  )
}
