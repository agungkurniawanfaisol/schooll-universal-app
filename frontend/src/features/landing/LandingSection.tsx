import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type SectionVariant = 'default' | 'muted' | 'spotlight'

interface LandingSectionProps {
  id?: string
  variant?: SectionVariant
  children: ReactNode
  className?: string
  containerClassName?: string
}

const variantStyles: Record<SectionVariant, string> = {
  default: 'bg-background',
  muted: 'section-alt',
  spotlight:
    'bg-gradient-to-b from-background via-muted/30 to-background',
}

export function LandingSection({
  id,
  variant = 'default',
  children,
  className,
  containerClassName,
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn('relative overflow-hidden py-20 md:py-28 lg:py-32', variantStyles[variant], className)}
    >
      <div className="landing-mesh pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl animate-orb-drift"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-accent/5 blur-3xl animate-orb-drift-reverse"
        aria-hidden
      />

      <div className={cn('container relative mx-auto px-4 lg:px-8', containerClassName)}>{children}</div>
    </section>
  )
}
