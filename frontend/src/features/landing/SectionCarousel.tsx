import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useRef, useState, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { fadeUp, springSoft, viewportOnce } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface SectionCarouselProps {
  children: ReactNode[]
  className?: string
  ariaLabel?: string
}

export function SectionCarousel({ children, className, ariaLabel = 'Carousel konten' }: SectionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.85
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
    setTimeout(updateScrollState, 350)
  }

  if (children.length === 0) return null

  return (
    <div className={cn('relative', className)} role="region" aria-label={ariaLabel}>
      {children.length > 1 && (
        <div className="mb-5 hidden justify-end gap-2 md:flex">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-full border-primary/20 bg-background/80 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-glow"
            aria-label="Geser ke kiri"
            disabled={!canScrollLeft}
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-full border-primary/20 bg-background/80 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-glow"
            aria-label="Geser ke kanan"
            disabled={!canScrollRight}
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="carousel-fade-edges flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {children.map((child, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{ ...springSoft, delay: i * 0.06 }}
            className="w-[85vw] shrink-0 snap-start sm:w-[340px] md:w-[380px] lg:w-[400px]"
          >
            {child}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
