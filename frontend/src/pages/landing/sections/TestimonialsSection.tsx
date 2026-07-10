import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CardContent } from '@/components/ui/card'
import { Carousel } from '@/components/ui/carousel'
import { LandingSection } from '@/features/landing/LandingSection'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { SectionHeader } from '@/features/landing/SectionHeader'
import { SectionReadMoreLink } from '@/features/landing/SectionReadMoreLink'
import { useLandingContext } from '@/features/landing/LandingDataContext'
import { fadeUp, springSoft, viewportOnce } from '@/lib/motion'
import { TestimonialSubmitForm } from '@/components/public/TestimonialSubmitForm'

export function TestimonialsSection() {
  const { data } = useLandingContext()
  const testimonials = data?.testimonials ?? []

  if (!testimonials.length) return null

  const slides = testimonials.map((item) => {
    const rating = Number(item.rating ?? 5)
    return (
      <PremiumCard key={String(item.id)} className="mx-auto max-w-3xl border-none bg-card/90 shadow-glow backdrop-blur-md" hover={false}>
        <CardContent className="space-y-6 p-8 md:p-12">
          <div className="flex justify-center gap-1">
            {Array.from({ length: rating }).map((_, j) => (
              <Star key={j} className="h-5 w-5 fill-warning text-warning" />
            ))}
          </div>
          <blockquote className="line-clamp-6 break-words text-center text-lg leading-relaxed text-foreground md:text-xl">
            &ldquo;{String(item.comment)}&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <Avatar className="h-14 w-14 ring-2 ring-primary/20">
              {item.photo ? (
                <AvatarImage src={String(item.photo)} alt={String(item.name)} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                  {String(item.name).charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="text-left">
              <p className="font-semibold">{String(item.name)}</p>
              <p className="text-sm text-muted-foreground">{String(item.occupation ?? '')}</p>
            </div>
          </div>
        </CardContent>
      </PremiumCard>
    )
  })

  return (
    <LandingSection id="testimoni" variant="muted">
      <SectionHeader
        eyebrow="Testimoni"
        title="Apa Kata Mereka"
        description="Kepercayaan orang tua, alumni, dan mitra pendidikan kami."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        transition={springSoft}
      >
        <Carousel items={slides} ariaLabel="Carousel testimoni" autoPlayMs={8000} />
      </motion.div>

      <SectionReadMoreLink to="/testimoni" label="Lihat semua testimoni" />

      <div className="mx-auto mt-12 max-w-xl">
        <TestimonialSubmitForm />
      </div>
    </LandingSection>
  )
}
