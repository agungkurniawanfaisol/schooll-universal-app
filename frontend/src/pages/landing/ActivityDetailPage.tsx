import { ArrowLeft, Calendar } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/api/utils'
import { usePublicActivity } from '@/hooks/usePublicContent'

export function ActivityDetailPage() {
  const { slug = '' } = useParams()
  const { data: activity, isLoading, isError } = usePublicActivity(slug)

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !activity) {
    return (
      <div className="container mx-auto px-4 py-24 text-center lg:px-8">
        <h1 className="text-2xl font-bold">Kegiatan tidak ditemukan</h1>
        <Button variant="gradient" className="mt-6" asChild>
          <Link to="/kegiatan">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Kegiatan
          </Link>
        </Button>
      </div>
    )
  }

  const title = String(activity.title ?? 'Kegiatan')

  return (
    <PublicPageShell title={title} description={activity.description ? String(activity.description) : title}>
      <article className="mx-auto max-w-3xl">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
          <Link to="/kegiatan">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Kegiatan
          </Link>
        </Button>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Badge variant="secondary">Kegiatan</Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatDate(activity.date)}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>

        {activity.image ? (
          <div className="mt-8 overflow-hidden rounded-2xl shadow-soft">
            <img src={String(activity.image)} alt={title} className="aspect-[16/9] w-full object-cover" />
          </div>
        ) : null}

        {activity.description ? (
          <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
            {String(activity.description)}
          </p>
        ) : null}
      </article>
    </PublicPageShell>
  )
}
