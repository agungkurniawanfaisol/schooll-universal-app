import { motion } from 'framer-motion'
import { Building2, CheckCircle2, GraduationCap } from 'lucide-react'

import { LandingSection } from '@/features/landing/LandingSection'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { SectionHeader } from '@/features/landing/SectionHeader'
import { useLandingContext } from '@/features/landing/LandingDataContext'
import { fadeInLeft, fadeInRight, springSoft, viewportOnce } from '@/lib/motion'
import { sanitizeHtml } from '@/lib/sanitizeHtml'

export function AboutSection() {
  const { data } = useLandingContext()
  const about = data?.about

  if (!about) return null

  const title = String(about.title ?? 'Tentang Kami')
  const content = sanitizeHtml(String(about.content ?? ''))

  const highlights = [
    'Kurikulum Merdeka terintegrasi',
    'Program bilingual & teknologi',
    'Pembinaan karakter & leadership',
  ]

  return (
    <LandingSection id="tentang" variant="default">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInLeft}
          transition={springSoft}
          className="relative"
        >
          <div className="card-premium aspect-[4/3] overflow-hidden rounded-3xl shadow-soft ring-1 ring-primary/10">
            {about.image ? (
              <img src={String(about.image)} alt={title} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 gradient-surface">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10">
                  <GraduationCap className="h-12 w-12 text-primary" />
                </div>
                <Building2 className="h-8 w-8 text-muted-foreground/40" />
              </div>
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ ...springSoft, delay: 0.15 }}
            className="relative mt-4 w-fit md:absolute md:-bottom-6 md:-right-6 md:mt-0"
          >
            <PremiumCard className="p-6 shadow-glow">
              <p className="text-3xl font-bold gradient-text">40+</p>
              <p className="text-sm text-muted-foreground">Tahun Berdedikasi</p>
            </PremiumCard>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInRight}
          transition={springSoft}
          className="space-y-6"
        >
          <SectionHeader eyebrow="Tentang Kami" title={title} align="left" className="mb-0" />
          <div
            className="prose prose-neutral max-w-none leading-relaxed text-muted-foreground dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <ul className="space-y-3 pt-2">
            {highlights.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ ...springSoft, delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </LandingSection>
  )
}
