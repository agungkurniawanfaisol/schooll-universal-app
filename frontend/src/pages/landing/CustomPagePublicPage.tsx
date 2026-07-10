import { useParams } from 'react-router-dom'

import { BackButton } from '@/components/common/BackButton'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { sanitizeHtml } from '@/lib/sanitizeHtml'
import { usePublicCustomPage } from '@/hooks/usePublicContent'

export function CustomPagePublicPage() {
  const { slug = '' } = useParams()
  const { data: page, isLoading, isError } = usePublicCustomPage(slug)

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !page) {
    return (
      <div className="container mx-auto px-4 py-24 text-center lg:px-8">
        <h1 className="text-2xl font-bold">Halaman tidak ditemukan</h1>
        <BackButton to="/" label="Kembali ke Beranda" variant="gradient" className="mt-6" />
        
      </div>
    )
  }

  const title = String(page.title ?? 'Halaman')

  return (
    <PublicPageShell backTo="/" backLabel="Kembali ke Beranda" title={title} description={page.meta_description ? String(page.meta_description) : title}>
      <article className="mx-auto max-w-3xl">
        
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {page.content ? (
          <div
            className="prose prose-neutral mt-8 max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(String(page.content)) }}
          />
        ) : null}
      </article>
    </PublicPageShell>
  )
}
