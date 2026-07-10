import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LandingSection } from '@/features/landing/LandingSection'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { useLandingContext } from '@/features/landing/LandingDataContext'
import { fadeInScale, springSoft, viewportOnce } from '@/lib/motion'

export function PrincipalSection() {
  const { data } = useLandingContext()
  const principal = data?.principal_message

  if (!principal) return null

  const name = String(principal.name ?? '')
  const title = String(principal.title ?? 'Kepala Sekolah')
  const message = String(principal.message ?? '')

  return (
    <LandingSection id="kepala-sekolah" variant="spotlight">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInScale}
        transition={springSoft}
        className="relative mx-auto max-w-4xl"
      >
        <PremiumCard className="overflow-hidden border-primary/10 bg-gradient-to-br from-card via-card to-primary/5 p-8 shadow-glow md:p-12">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/8 blur-3xl animate-orb-drift" aria-hidden />
          <Quote className="relative mb-6 h-10 w-10 text-primary/30" aria-hidden />
          <blockquote className="relative break-words text-lg leading-relaxed md:text-xl lg:text-2xl lg:leading-relaxed">
            {message}
          </blockquote>
          <div className="relative mt-8 flex items-center gap-4 border-t border-border/50 pt-8">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20 transition-all duration-300 hover:ring-primary/40">
              {principal.photo ? (
                <AvatarImage src={String(principal.photo)} alt={name} />
              ) : (
                <AvatarFallback className="gradient-bg text-lg text-primary-foreground">
                  {name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-semibold">{name}</p>
              <p className="text-sm text-muted-foreground">{title}</p>
            </div>
          </div>
        </PremiumCard>
      </motion.div>
    </LandingSection>
  )
}
