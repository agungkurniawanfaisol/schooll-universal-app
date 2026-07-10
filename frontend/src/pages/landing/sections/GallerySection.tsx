import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ImageIcon, X, ZoomIn } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { LandingSection } from '@/features/landing/LandingSection'
import { SectionHeader } from '@/features/landing/SectionHeader'
import { SectionReadMoreLink } from '@/features/landing/SectionReadMoreLink'
import { useLandingContext } from '@/features/landing/LandingDataContext'
import { fadeInScale, springSoft, viewportOnce } from '@/lib/motion'

interface GalleryItem {
  id: string
  slug: string
  title: string
  image?: string
  description?: string
}

export function GallerySection() {
  const { data, settings } = useLandingContext()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const galleryItems = useMemo<GalleryItem[]>(() => {
    const items: GalleryItem[] = []
    for (const gallery of data?.galleries ?? []) {
      const images = (gallery.images as string[] | undefined) ?? []
      const cover = gallery.cover_image ? String(gallery.cover_image) : images[0]
      items.push({
        id: String(gallery.id),
        slug: String(gallery.slug),
        title: String(gallery.title),
        image: cover,
        description: gallery.description ? String(gallery.description) : undefined,
      })
    }
    return items
  }, [data?.galleries])

  if (!galleryItems.length) return null

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prev = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + galleryItems.length) % galleryItems.length : null))
  const next = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % galleryItems.length : null))

  return (
    <LandingSection id="galeri" variant="spotlight">
      <SectionHeader
        eyebrow="Galeri"
        title="Momen Berharga di Sekolah"
        description={`Dokumentasi kegiatan, prestasi, dan kebersamaan di ${settings.schoolName}.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInScale}
            transition={{ ...springSoft, delay: i * 0.05 }}
            className="card-premium group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-glow"
          >
            <button
              type="button"
              onClick={() => openLightbox(i)}
              className="absolute inset-0 z-10"
              aria-label={`Lihat ${item.title}`}
            />
            <Link
              to={`/galeri/${item.slug}`}
              className="absolute right-3 top-3 z-20 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
            >
              Album
            </Link>
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center gradient-surface">
                <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
              <p className="font-medium text-white">{item.title}</p>
              {item.description ? (
                <p className="line-clamp-2 text-sm text-white/70">{item.description}</p>
              ) : null}
            </div>
            <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/50 p-2 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 sm:top-auto sm:bottom-3">
              <ZoomIn className="h-4 w-4 text-white" />
            </div>
          </motion.div>
        ))}
      </div>

      <SectionReadMoreLink to="/galeri" label="Lihat semua galeri" />

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 text-white hover:bg-white/10" onClick={closeLightbox}>
              <X className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="absolute left-4 text-white hover:bg-white/10" onClick={(e) => { e.stopPropagation(); prev() }}>
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={springSoft}
              className="max-w-3xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryItems[lightboxIndex].image ? (
                <img src={galleryItems[lightboxIndex].image} alt={galleryItems[lightboxIndex].title} className="mx-auto max-h-[70vh] rounded-xl object-contain shadow-2xl" />
              ) : (
                <div className="mb-6 flex justify-center">
                  <ImageIcon className="h-24 w-24 text-white/30" />
                </div>
              )}
              <h3 className="mt-4 break-words text-xl font-bold text-white sm:text-2xl">{galleryItems[lightboxIndex].title}</h3>
              <Button variant="secondary" className="mt-4" asChild>
                <Link to={`/galeri/${galleryItems[lightboxIndex].slug}`} onClick={closeLightbox}>
                  Lihat album lengkap
                </Link>
              </Button>
            </motion.div>
            <Button variant="ghost" size="icon" className="absolute right-4 text-white hover:bg-white/10 sm:right-16" onClick={(e) => { e.stopPropagation(); next() }}>
              <ChevronRight className="h-8 w-8" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </LandingSection>
  )
}
