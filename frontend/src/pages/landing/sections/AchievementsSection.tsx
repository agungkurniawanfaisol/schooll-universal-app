import { motion } from 'framer-motion'
import { Award } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { CardContent } from '@/components/ui/card'
import { LandingSection } from '@/features/landing/LandingSection'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { SectionHeader } from '@/features/landing/SectionHeader'
import { SectionReadMoreLink } from '@/features/landing/SectionReadMoreLink'
import { useLandingContext } from '@/features/landing/LandingDataContext'
import { fadeUp, springSoft, viewportOnce } from '@/lib/motion'

export function AchievementsSection() {
  const { data } = useLandingContext()
  const achievements = data?.achievements ?? []

  if (!achievements.length) return null

  return (
    <LandingSection id="prestasi" variant="muted">
      <SectionHeader eyebrow="Prestasi" title="Pencapaian Gemilang" />

      <div className="grid gap-4 md:grid-cols-2">
        {achievements.map((item, i) => (
          <motion.div
            key={String(item.id)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{ ...springSoft, delay: i * 0.06 }}
          >
            <Link to={`/prestasi/${String(item.slug)}`} className="group block h-full">
              <PremiumCard className="h-full">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 transition-all duration-500 group-hover:bg-accent/25 group-hover:shadow-glow">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {item.category ? <Badge variant="secondary">{String(item.category)}</Badge> : null}
                      {item.year ? <span className="text-sm text-muted-foreground">{String(item.year)}</span> : null}
                    </div>
                    <h3 className="break-words font-semibold transition-colors duration-300 group-hover:text-primary">
                      {String(item.title)}
                    </h3>
                    {item.description ? (
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {String(item.description)}
                      </p>
                    ) : null}
                  </div>
                </CardContent>
              </PremiumCard>
            </Link>
          </motion.div>
        ))}
      </div>

      <SectionReadMoreLink to="/prestasi" label="Lihat semua prestasi" />
    </LandingSection>
  )
}
