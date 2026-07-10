import { Award } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { BackButton } from '@/components/common/BackButton'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { Badge } from '@/components/ui/badge'
import { usePublicAchievement } from '@/hooks/usePublicContent'

export function AchievementDetailPage() {
  const { slug = '' } = useParams()
  const { data: achievement, isLoading, isError } = usePublicAchievement(slug)

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !achievement) {
    return (
      <div className="container mx-auto px-4 py-24 text-center lg:px-8">
        <h1 className="text-2xl font-bold">Prestasi tidak ditemukan</h1>
        <BackButton to="/prestasi" label="Kembali ke Prestasi" variant="gradient" className="mt-6" />
      </div>
    )
  }

  const title = String(achievement.title ?? 'Prestasi')

  return (
    <PublicPageShell backTo="/prestasi" backLabel="Kembali ke Prestasi" title={title} description={achievement.description ? String(achievement.description) : title}>
      <article className="mx-auto max-w-3xl">
<div className="mb-4 flex flex-wrap items-center gap-3">
          <Award className="h-6 w-6 text-accent" />
          {achievement.category ? <Badge variant="secondary">{String(achievement.category)}</Badge> : null}
          {achievement.year ? <span className="text-sm text-muted-foreground">{String(achievement.year)}</span> : null}
        </div>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>

        {achievement.description ? (
          <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
            {String(achievement.description)}
          </p>
        ) : null}
      </article>
    </PublicPageShell>
  )
}
