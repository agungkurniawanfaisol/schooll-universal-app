import { Building2 } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { BackButton } from '@/components/common/BackButton'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { usePublicFacility } from '@/hooks/usePublicContent'

export function FacilityDetailPage() {
  const { slug = '' } = useParams()
  const { data: facility, isLoading, isError } = usePublicFacility(slug)

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !facility) {
    return (
      <div className="container mx-auto px-4 py-24 text-center lg:px-8">
        <h1 className="text-2xl font-bold">Fasilitas tidak ditemukan</h1>
        <BackButton to="/fasilitas" label="Kembali ke Fasilitas" variant="gradient" className="mt-6" />
      </div>
    )
  }

  const title = String(facility.title ?? 'Fasilitas')

  return (
    <PublicPageShell backTo="/fasilitas" backLabel="Kembali ke Fasilitas" title={title} description={facility.description ? String(facility.description) : title}>
      <article className="mx-auto max-w-3xl">
<h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>

        {facility.image ? (
          <div className="mt-8 overflow-hidden rounded-2xl shadow-soft">
            <img src={String(facility.image)} alt={title} className="aspect-[16/9] w-full object-cover" />
          </div>
        ) : (
          <div className="mt-8 flex justify-center rounded-2xl bg-primary/10 p-12">
            <Building2 className="h-16 w-16 text-primary" />
          </div>
        )}

        {facility.description ? (
          <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
            {String(facility.description)}
          </p>
        ) : null}
      </article>
    </PublicPageShell>
  )
}
