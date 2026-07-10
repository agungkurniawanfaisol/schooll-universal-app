import { Calendar, Clock, MapPin } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { BackButton } from '@/components/common/BackButton'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/api/utils'
import { usePublicAgenda } from '@/hooks/usePublicContent'

export function AgendaDetailPage() {
  const { slug = '' } = useParams()
  const { data: agenda, isLoading, isError } = usePublicAgenda(slug)

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !agenda) {
    return (
      <div className="container mx-auto px-4 py-24 text-center lg:px-8">
        <h1 className="text-2xl font-bold">Agenda tidak ditemukan</h1>
        <p className="mt-2 text-muted-foreground">Agenda mungkin telah dihapus atau belum dipublikasikan.</p>
        <BackButton to="/agenda" label="Kembali ke Agenda" variant="gradient" className="mt-6" />
      </div>
    )
  }

  const title = String(agenda.title ?? 'Agenda')

  return (
    <PublicPageShell backTo="/agenda" backLabel="Kembali ke Agenda" title={title} description={agenda.description ? String(agenda.description) : title}>
      <article className="mx-auto max-w-3xl">
<div className="mb-4 flex flex-wrap items-center gap-3">
          <Badge variant="secondary">Agenda</Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatDate(agenda.date)}
            {agenda.end_date ? ` – ${formatDate(agenda.end_date)}` : ''}
          </span>
          {agenda.time ? (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {String(agenda.time).slice(0, 5)}
            </span>
          ) : null}
        </div>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>

        {agenda.location ? (
          <p className="mt-4 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            {String(agenda.location)}
          </p>
        ) : null}

        {agenda.thumbnail ? (
          <div className="mt-8 overflow-hidden rounded-2xl shadow-soft">
            <img
              src={String(agenda.thumbnail)}
              alt={title}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        ) : null}

        {agenda.description ? (
          <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
            {String(agenda.description)}
          </p>
        ) : null}
      </article>
    </PublicPageShell>
  )
}
