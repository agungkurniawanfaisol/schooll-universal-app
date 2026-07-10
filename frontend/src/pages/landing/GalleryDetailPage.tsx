import { ArrowLeft, ImageIcon } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { Button } from '@/components/ui/button'
import { usePublicGallery } from '@/hooks/usePublicContent'

export function GalleryDetailPage() {
  const { slug = '' } = useParams()
  const { data: gallery, isLoading, isError } = usePublicGallery(slug)

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !gallery) {
    return (
      <div className="container mx-auto px-4 py-24 text-center lg:px-8">
        <h1 className="text-2xl font-bold">Galeri tidak ditemukan</h1>
        <Button variant="gradient" className="mt-6" asChild>
          <Link to="/galeri">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Galeri
          </Link>
        </Button>
      </div>
    )
  }

  const title = String(gallery.title ?? 'Galeri')
  const images = (gallery.images as string[] | undefined) ?? []
  const cover = gallery.cover_image ? String(gallery.cover_image) : images[0]
  const allImages = cover && !images.includes(cover) ? [cover, ...images] : images.length ? images : cover ? [cover] : []

  return (
    <PublicPageShell title={title} description={gallery.description ? String(gallery.description) : title}>
      <article className="mx-auto max-w-5xl">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
          <Link to="/galeri">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Galeri
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {gallery.description ? (
          <p className="mt-4 text-lg text-muted-foreground">{String(gallery.description)}</p>
        ) : null}

        {allImages.length ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allImages.map((src, index) => (
              <div key={`${src}-${index}`} className="aspect-[4/3] overflow-hidden rounded-2xl shadow-soft">
                <img src={src} alt={`${title} ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 flex justify-center rounded-2xl border border-dashed p-16">
            <ImageIcon className="h-16 w-16 text-muted-foreground/40" />
          </div>
        )}
      </article>
    </PublicPageShell>
  )
}
