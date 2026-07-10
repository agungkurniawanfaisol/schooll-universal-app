import type { Transition, Variants } from 'framer-motion'

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
}

export const springSoft: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
}

export const springCarousel: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 32,
}

export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 22,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0 },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0 },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0 },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
}

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.02 },
  },
}

export const viewportOnce = { once: true, margin: '-60px' as const }
