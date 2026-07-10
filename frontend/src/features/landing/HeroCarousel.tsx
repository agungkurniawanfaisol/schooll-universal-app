import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, GraduationCap, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Carousel } from '@/components/ui/carousel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { LandingSettings } from '@/features/landing/LandingDataContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { fadeUp, springSoft, staggerContainer, viewportOnce } from '@/lib/motion'
import type { ApiRecord } from '@/api/utils'

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      setCount(value)
      return
    }
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value, reduced])

  return (
    <span>
      {count.toLocaleString('id-ID')}
      {suffix}
    </span>
  )
}

function HeroSlide({
  slide,
  settings,
}: {
  slide: ApiRecord
  settings: LandingSettings
}) {
  const reduced = useReducedMotion()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5])
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5])
  const { scrollY } = useScroll()
  const parallaxY = useTransform(scrollY, [0, 700], [0, reduced ? 0 : 90])
  const contentY = useTransform(scrollY, [0, 700], [0, reduced ? 0 : 35])

  const title = String(slide.title ?? settings.schoolName)
  const subtitle = String(slide.subtitle ?? settings.schoolTagline)
  const description = String(slide.description ?? '')
  const ctaText = String(slide.cta_text ?? 'Pelajari Lebih Lanjut')
  const ctaUrl = String(slide.cta_url ?? '#tentang')
  const bgImage = slide.background_image ? String(slide.background_image) : null

  return (
    <div
      className="relative min-h-[75dvh] lg:min-h-[82dvh]"
      onMouseMove={
        reduced
          ? undefined
          : (e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              mouseX.set(e.clientX - rect.left - rect.width / 2)
              mouseY.set(e.clientY - rect.top - rect.height / 2)
            }
      }
    >
      {bgImage ? (
        <motion.div className="absolute inset-0 overflow-hidden" style={{ y: parallaxY }}>
          <div
            className="h-[115%] w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 gradient-overlay" />
        </motion.div>
      ) : (
        <motion.div className="absolute inset-0 gradient-hero-bg" style={{ y: parallaxY }} />
      )}

      <div className="landing-mesh pointer-events-none absolute inset-0" aria-hidden />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full glow-accent blur-3xl animate-orb-drift" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full glow-primary blur-3xl animate-orb-drift-reverse" />
      </div>

      <motion.div
        className="container relative mx-auto grid items-center gap-12 px-4 py-14 lg:grid-cols-2 lg:px-8 lg:py-20"
        style={{ y: contentY }}
      >
        <motion.div
          className="space-y-8"
          initial={reduced ? { opacity: 0 } : 'hidden'}
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} transition={springSoft}>
            <Badge
              variant="secondary"
              className="gap-2 border-hero bg-hero-surface px-4 py-1.5 text-hero-foreground shadow-soft backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-hero-accent animate-float" />
              {settings.schoolName}
            </Badge>
          </motion.div>

          <div className="space-y-4">
            <motion.p
              variants={fadeUp}
              transition={springSoft}
              className="text-sm font-semibold uppercase tracking-[0.22em] text-hero-accent"
            >
              {subtitle}
            </motion.p>
            <motion.h1
              variants={fadeUp}
              transition={springSoft}
              className="text-balance text-3xl font-bold leading-[1.08] tracking-tight text-hero-foreground sm:text-4xl md:text-5xl lg:text-[3.4rem]"
            >
              {title}
            </motion.h1>
            {description ? (
              <motion.p
                variants={fadeUp}
                transition={springSoft}
                className="max-w-xl text-lg leading-relaxed text-hero-muted md:text-xl"
              >
                {description}
              </motion.p>
            ) : null}
          </div>

          <motion.div
            variants={fadeUp}
            transition={springSoft}
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4"
          >
            <Button variant="gradient" size="lg" className="min-h-11 w-full shadow-glow sm:w-auto" asChild>
              <a href={ctaUrl}>
                {ctaText}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Button>
            {settings.ppdbUrl ? (
              <Button variant="glassHero" size="lg" className="min-h-11 w-full sm:w-auto" asChild>
                <a href={settings.ppdbUrl}>Daftar PPDB</a>
              </Button>
            ) : (
              <Button variant="glassHero" size="lg" className="min-h-11 w-full sm:w-auto" asChild>
                <a href="#kontak">Hubungi Kami</a>
              </Button>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...springSoft, delay: 0.2 }}
          style={reduced ? undefined : { rotateX, rotateY, perspective: 1200 }}
          className="hidden lg:block"
        >
          <div className="hero-card card-premium-shine relative overflow-hidden p-1.5 shadow-2xl ring-1 ring-hero">
            <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl gradient-surface">
              <div className="mb-6 flex h-28 w-28 animate-float items-center justify-center rounded-3xl bg-hero-surface shadow-glow backdrop-blur-md ring-1 ring-hero">
                <GraduationCap className="h-14 w-14 text-hero-foreground" />
              </div>
              <p className="text-xl font-semibold text-hero-foreground">{settings.schoolName}</p>
              <p className="mt-1 text-sm text-hero-subtle">{settings.schoolTagline}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

interface HeroCarouselProps {
  slides: ApiRecord[]
  settings: LandingSettings
}

export function HeroCarousel({ slides, settings }: HeroCarouselProps) {
  const slideItems = slides.map((slide, i) => (
    <HeroSlide key={String(slide.id ?? i)} slide={slide} settings={settings} />
  ))

  return (
    <section id="hero" className="relative overflow-hidden pt-24">
      <Carousel
        items={slideItems}
        ariaLabel={`Hero carousel ${settings.schoolName}`}
        autoPlayMs={6000}
        className="rounded-none"
        tone="hero"
      />

      <div className="relative border-t border-hero gradient-hero-bg">
        <div className="landing-mesh pointer-events-none absolute inset-0" aria-hidden />
        <div className="container relative mx-auto grid grid-cols-2 gap-4 px-4 py-10 md:grid-cols-4 lg:px-8 lg:py-12">
          {settings.heroStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ ...springSoft, delay: i * 0.08 }}
              className="hero-card hero-stat-divider p-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow md:p-6"
            >
              <p className="text-2xl font-bold text-hero-foreground md:text-3xl lg:text-4xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-wide text-hero-subtle md:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
