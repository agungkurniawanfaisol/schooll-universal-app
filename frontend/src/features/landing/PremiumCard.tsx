import type { ElementType, ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface PremiumCardProps {
  children: ReactNode
  className?: string
  as?: ElementType
  hover?: boolean
}

export function PremiumCard({
  children,
  className,
  as: Component = 'div',
  hover = true,
}: PremiumCardProps) {
  return (
    <Component
      className={cn(
        'card-premium rounded-2xl',
        hover && 'group transition-all duration-500 hover:-translate-y-1 hover:shadow-glow',
        className,
      )}
    >
      {children}
    </Component>
  )
}
