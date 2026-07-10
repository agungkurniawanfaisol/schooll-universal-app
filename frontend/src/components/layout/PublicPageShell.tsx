import type { ReactNode } from 'react'

import { SEOHead } from '@/components/common/SEOHead'

interface PublicPageShellProps {
  title: string
  description?: string
  children: ReactNode
}

export function PublicPageShell({ title, description, children }: PublicPageShellProps) {
  return (
    <>
      <SEOHead title={title} description={description ?? title} />
      <section className="relative min-h-[60vh] overflow-hidden pb-16 pt-24 md:pb-24 lg:pb-28 lg:pt-28">
        <div className="landing-mesh pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="pointer-events-none absolute -left-24 top-20 h-56 w-56 rounded-full bg-primary/6 blur-3xl animate-orb-drift"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-accent/6 blur-3xl animate-orb-drift-reverse"
          aria-hidden
        />
        <div className="container relative mx-auto px-4 lg:px-8">{children}</div>
      </section>
    </>
  )
}
