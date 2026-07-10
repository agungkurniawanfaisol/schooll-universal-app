import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { motion } from 'framer-motion'

import { springSoft, viewportOnce } from '@/lib/motion'

interface SectionReadMoreLinkProps {
  to: string
  label: string
}

export function SectionReadMoreLink({ to, label }: SectionReadMoreLinkProps) {
  return (
    <motion.div
      className="mt-12 flex justify-center"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ ...springSoft, delay: 0.1 }}
    >
      <Link
        to={to}
        className="group inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-background/80 px-6 py-3 text-sm font-semibold text-foreground shadow-soft backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:shadow-glow"
      >
        {label}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </motion.div>
  )
}
