import { motion } from 'framer-motion'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { springSoft, viewportOnce } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  description?: string
  className?: string
  align?: 'left' | 'center'
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = 'center',
}: SectionHeaderProps) {
  const reduced = useReducedMotion()
  const isCenter = align === 'center'

  return (
    <motion.header
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={springSoft}
      className={cn(
        'mb-10 md:mb-14',
        isCenter ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl',
        className,
      )}
    >
      <div
        className={cn(
          'mb-4 flex items-center gap-3',
          isCenter ? 'justify-center' : 'justify-start',
        )}
      >
        <span
          className={cn(
            'h-px bg-gradient-to-r from-primary/60 to-transparent',
            isCenter ? 'w-10' : 'w-8',
          )}
          aria-hidden
        />
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
        {isCenter ? (
          <span className="h-px w-10 bg-gradient-to-l from-primary/60 to-transparent" aria-hidden />
        ) : null}
      </div>

      <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.85rem] lg:leading-[1.12]">
        {title.includes(' ') ? (
          <>
            <span className="gradient-text">{title.split(' ')[0]}</span>
            <span className="text-foreground"> {title.split(' ').slice(1).join(' ')}</span>
          </>
        ) : (
          <span className="gradient-text">{title}</span>
        )}
      </h2>

      {description ? (
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
          {description}
        </p>
      ) : null}
    </motion.header>
  )
}
