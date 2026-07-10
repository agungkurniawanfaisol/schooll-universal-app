import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useState, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { springCarousel } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface CarouselProps {
  items: ReactNode[]
  className?: string
  ariaLabel?: string
  showDots?: boolean
  autoPlayMs?: number
  tone?: 'default' | 'hero'
}

export function Carousel({
  items,
  className,
  ariaLabel = 'Carousel',
  showDots = true,
  autoPlayMs,
  tone = 'default',
}: CarouselProps) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const count = items.length

  const go = useCallback(
    (next: number) => setIndex((next + count) % count),
    [count],
  )

  useEffect(() => {
    if (!autoPlayMs || count <= 1 || reduced) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), autoPlayMs)
    return () => clearInterval(timer)
  }, [autoPlayMs, count, reduced])

  if (count === 0) return null

  const isHero = tone === 'hero'
  const navVariant = isHero ? 'glassHero' : 'glass'
  const activeDotClass = isHero ? 'bg-hero-foreground' : 'bg-primary'
  const inactiveDotClass = isHero
    ? 'bg-hero-foreground/25 hover:bg-hero-foreground/40'
    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'

  return (
    <div
      className={cn('relative', className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 48 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -48 }}
            transition={reduced ? { duration: 0.15 } : springCarousel}
          >
            {items[index]}
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <>
          <Button
            type="button"
            variant={navVariant}
            size="icon"
            className="absolute left-2 top-1/2 z-10 h-11 w-11 -translate-y-1/2 sm:left-4"
            aria-label="Slide sebelumnya"
            onClick={() => go(index - 1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant={navVariant}
            size="icon"
            className="absolute right-2 top-1/2 z-10 h-11 w-11 -translate-y-1/2 sm:right-4"
            aria-label="Slide berikutnya"
            onClick={() => go(index + 1)}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {showDots && (
            <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Indikator slide">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Slide ${i + 1}`}
                  className={cn(
                    'h-2.5 min-w-[10px] rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    i === index ? cn('w-8', activeDotClass) : cn('w-2.5', inactiveDotClass),
                  )}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
