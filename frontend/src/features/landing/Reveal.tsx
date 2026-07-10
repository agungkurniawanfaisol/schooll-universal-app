import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { fadeUp, staggerContainer, viewportOnce, springSoft } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface RevealProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  delay?: number
}

export function Reveal({ children, className, delay = 0, ...props }: RevealProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : 'hidden'}
      whileInView={reduced ? { opacity: 1 } : 'visible'}
      viewport={viewportOnce}
      variants={fadeUp}
      transition={{ ...springSoft, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface RevealGroupProps extends HTMLMotionProps<'div'> {
  children: ReactNode
}

export function RevealGroup({ children, className, ...props }: RevealGroupProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : 'hidden'}
      whileInView={reduced ? { opacity: 1 } : 'visible'}
      viewport={viewportOnce}
      variants={staggerContainer}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className, ...props }: RevealProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      variants={reduced ? undefined : fadeUp}
      transition={springSoft}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
