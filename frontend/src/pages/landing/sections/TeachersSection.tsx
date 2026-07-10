import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LandingSection } from '@/features/landing/LandingSection'
import { PremiumCard } from '@/features/landing/PremiumCard'
import { SectionHeader } from '@/features/landing/SectionHeader'
import { SectionReadMoreLink } from '@/features/landing/SectionReadMoreLink'
import { useLandingContext } from '@/features/landing/LandingDataContext'
import { fadeUp, springSoft, viewportOnce } from '@/lib/motion'

export function TeachersSection() {
  const { data } = useLandingContext()
  const teachers = data?.teachers ?? []

  if (!teachers.length) return null

  return (
    <LandingSection id="guru" variant="muted">
      <SectionHeader
        eyebrow="Tenaga Pendidik"
        title="Guru Profesional & Berpengalaman"
        description="Tim pengajar berdedikasi yang membimbing siswa menuju prestasi akademik dan karakter."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teachers.map((teacher, i) => (
          <motion.div
            key={String(teacher.id)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{ ...springSoft, delay: i * 0.07 }}
          >
            <Link to={`/guru/${String(teacher.slug)}`} className="group block h-full">
              <PremiumCard className="h-full overflow-hidden">
                <CardContent className="p-6 text-center">
                  <Avatar className="mx-auto mb-4 h-20 w-20 ring-2 ring-primary/10 transition-all duration-500 group-hover:ring-primary/30 group-hover:scale-105">
                    {teacher.photo ? (
                      <AvatarImage src={String(teacher.photo)} alt={String(teacher.name)} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                        {String(teacher.name).charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <h3 className="line-clamp-2 break-words font-semibold transition-colors duration-300 group-hover:text-primary">
                    {String(teacher.name)}
                  </h3>
                  <p className="text-sm text-primary">{String(teacher.position ?? teacher.subject)}</p>
                  {teacher.subject ? (
                    <p className="mt-1 text-xs text-muted-foreground">{String(teacher.subject)}</p>
                  ) : null}
                </CardContent>
              </PremiumCard>
            </Link>
          </motion.div>
        ))}
      </div>

      <SectionReadMoreLink to="/guru" label="Lihat semua guru" />
    </LandingSection>
  )
}
