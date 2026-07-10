import { motion } from 'framer-motion'
import { Eye, Heart, Target } from 'lucide-react'

import { CardContent } from '@/components/ui/card'
import { LandingSection } from '@/features/landing/LandingSection'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { SectionHeader } from '@/features/landing/SectionHeader'
import { SectionReadMoreLink } from '@/features/landing/SectionReadMoreLink'
import { useLandingContext } from '@/features/landing/LandingDataContext'
import { fadeInScale, springSoft, viewportOnce } from '@/lib/motion'

const iconMap: Record<string, typeof Eye> = {
  eye: Eye,
  target: Target,
  heart: Heart,
}

export function VisionMissionSection() {
  const { data } = useLandingContext()
  const items = data?.vision_mission ?? []

  if (!items.length) return null

  const vision = items.filter((item) => item.type === 'vision')
  const missions = items.filter((item) => item.type === 'mission')

  return (
    <LandingSection id="visi-misi" variant="muted">
      <SectionHeader eyebrow="Visi & Misi" title="Arah & Komitmen Kami" />

      <div className="grid gap-6 lg:grid-cols-12">
        {vision.map((item, i) => {
          const Icon = iconMap[String(item.icon ?? 'eye')] ?? Eye
          return (
            <motion.div
              key={String(item.id)}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeInScale}
              transition={{ ...springSoft, delay: i * 0.08 }}
              className="lg:col-span-5"
            >
              <PremiumCard className="h-full overflow-hidden bg-gradient-to-br from-primary/10 via-card to-accent/5 shadow-glow">
                <CardContent className="relative space-y-5 p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-bg text-primary-foreground shadow-glow">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="break-words text-2xl font-bold">{String(item.title ?? 'Visi')}</h3>
                  <p className="line-clamp-4 break-words text-lg leading-relaxed text-muted-foreground">
                    {String(item.content ?? '')}
                  </p>
                </CardContent>
              </PremiumCard>
            </motion.div>
          )
        })}

        <div className="grid gap-4 lg:col-span-7">
          {missions.map((item, i) => {
            const Icon = iconMap[String(item.icon ?? 'target')] ?? Target
            return (
              <motion.div
                key={String(item.id)}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ ...springSoft, delay: i * 0.08 }}
              >
                <PremiumCard className="transition-all duration-500 hover:shadow-glow">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/15">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="break-words font-semibold">{String(item.title ?? 'Misi')}</h3>
                      <p className="mt-1 line-clamp-3 break-words leading-relaxed text-muted-foreground">
                        {String(item.content ?? '')}
                      </p>
                    </div>
                  </CardContent>
                </PremiumCard>
              </motion.div>
            )
          })}
        </div>
      </div>

      <SectionReadMoreLink to="/visi-misi" label="Selengkapnya" />
    </LandingSection>
  )
}
