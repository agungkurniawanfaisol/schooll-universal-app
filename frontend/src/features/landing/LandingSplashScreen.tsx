import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import type { LandingSettings } from '@/features/landing/LandingDataContext'
import { useLandingContext } from '@/features/landing/LandingDataContext'
import { springBouncy, springSoft } from '@/lib/motion'
import { resolveSafeMediaUrl } from '@/lib/safeMediaUrl'
import { cn } from '@/lib/utils'

const SPLASH_SESSION_PREFIX = 'landing-splash-seen:v2'

function buildSplashFingerprint(settings: LandingSettings): string {
  return [
    settings.schoolName,
    settings.schoolLogo,
    settings.splashScreenEnabled ? '1' : '0',
  ].join('|')
}

function hasSeenSplash(fingerprint: string): boolean {
  const legacyKey = sessionStorage.getItem('landing-splash-seen')
  if (legacyKey === '1') {
    sessionStorage.removeItem('landing-splash-seen')
  }

  return sessionStorage.getItem(`${SPLASH_SESSION_PREFIX}:${fingerprint}`) === '1'
}

function markSplashSeen(fingerprint: string): void {
  sessionStorage.setItem(`${SPLASH_SESSION_PREFIX}:${fingerprint}`, '1')
}

export function LandingSplashScreen() {
  const { settings } = useLandingContext()

  if (!settings.splashScreenEnabled) {
    return null
  }

  return <LandingSplashScreenContent settings={settings} />
}

function LandingSplashScreenContent({ settings }: { settings: LandingSettings }) {
  const prefersReducedMotion = useReducedMotion()
  const fingerprint = useMemo(() => buildSplashFingerprint(settings), [settings])
  const [shouldRender] = useState(() => !hasSeenSplash(fingerprint))
  const [isVisible, setIsVisible] = useState(shouldRender)

  const schoolLogo = resolveSafeMediaUrl(settings.schoolLogo)
  const displayDuration = prefersReducedMotion ? 500 : 2600

  useEffect(() => {
    if (!shouldRender) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const timer = window.setTimeout(() => setIsVisible(false), displayDuration)

    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = previousOverflow
    }
  }, [displayDuration, shouldRender])

  const handleExitComplete = () => {
    markSplashSeen(fingerprint)
    document.body.style.overflow = ''
  }

  if (!shouldRender) return null

  return createPortal(
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isVisible ? (
        <motion.div
          key="landing-splash"
          role="dialog"
          aria-modal="true"
          aria-label={`Selamat datang di ${settings.schoolName}`}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.55, ease: 'easeInOut' }}
        >
          <div className="landing-mesh pointer-events-none absolute inset-0 opacity-70" aria-hidden />
          <div
            className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/15 blur-3xl animate-orb-drift"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-20 bottom-1/4 h-64 w-64 rounded-full bg-accent/15 blur-3xl animate-orb-drift-reverse"
            aria-hidden
          />

          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.82, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : springBouncy}
              className="relative"
            >
              <div className="absolute inset-0 rounded-[2rem] bg-primary/20 blur-2xl" aria-hidden />
              {schoolLogo ? (
                <img
                  src={schoolLogo}
                  alt={settings.schoolName}
                  className="relative h-28 w-28 rounded-[2rem] object-contain bg-card/80 p-4 shadow-glow ring-1 ring-primary/20 sm:h-32 sm:w-32"
                />
              ) : (
                <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] gradient-bg text-primary-foreground shadow-glow sm:h-32 sm:w-32">
                  <GraduationCap className="h-14 w-14 sm:h-16 sm:w-16" />
                </div>
              )}
            </motion.div>

            <motion.h1
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { ...springSoft, delay: 0.12 }
              }
              className="mt-8 max-w-xl text-2xl font-bold tracking-tight sm:text-3xl"
            >
              {settings.schoolName}
            </motion.h1>

            {settings.schoolTagline ? (
              <motion.p
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { ...springSoft, delay: 0.22 }
                }
                className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base"
              >
                {settings.schoolTagline}
              </motion.p>
            ) : null}
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 px-8 pb-10 sm:px-12">
            <div className="mx-auto h-1 max-w-xs overflow-hidden rounded-full bg-primary/10">
              <motion.div
                className={cn('h-full rounded-full gradient-bg shadow-glow')}
                initial={{ width: prefersReducedMotion ? '100%' : '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: prefersReducedMotion ? 0.2 : displayDuration / 1000,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
