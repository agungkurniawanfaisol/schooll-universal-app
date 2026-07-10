import { Calendar } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { BackButton } from '@/components/common/BackButton'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { SEOHead } from '@/components/common/SEOHead'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/api/utils'
import { usePublicNews } from '@/hooks/usePublicContent'
import { sanitizeHtml } from '@/lib/sanitizeHtml'

const BACK_TO = '/berita'
const BACK_LABEL = 'Kembali ke Berita'

export function NewsDetailPage() {
  const { slug = '' } = useParams()
  const { data: article, isLoading, isError } = usePublicNews(slug)

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !article) {
    return (
      <div className="container mx-auto px-4 py-24 text-center lg:px-8">
        <h1 className="text-2xl font-bold">Berita tidak ditemukan</h1>
        <p className="mt-2 text-muted-foreground">Artikel mungkin telah dihapus atau belum dipublikasikan.</p>
        <BackButton to="/" label="Kembali ke Beranda" variant="gradient" className="mt-6" />
      </div>
    )
  }

  const title = String(article.title ?? 'Berita')
  const excerpt = String(article.excerpt ?? '')
  const content = sanitizeHtml(String(article.content ?? ''))

  return (
    <>
      <SEOHead
        title={title}
        description={excerpt || title}
        ogImage={article.thumbnail ? String(article.thumbnail) : undefined}
        canonical={typeof window !== 'undefined' ? `${window.location.origin}/berita/${slug}` : undefined}
      />
      <article className="surface-page py-24 md:py-28">
        <div className="container mx-auto max-w-3xl px-4 lg:px-8">
          <BackButton to={BACK_TO} label={BACK_LABEL} className="mb-6" />

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge variant="secondary">Berita</Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatDate(article.published_at ?? article.created_at)}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
          {excerpt ? <p className="mt-4 text-lg text-muted-foreground">{excerpt}</p> : null}

          {article.thumbnail ? (
            <div className="mt-8 overflow-hidden rounded-2xl shadow-soft">
              <img
                src={String(article.thumbnail)}
                alt={title}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          ) : null}

          <div
            className="prose prose-neutral mt-10 max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </article>
    </>
  )
}
