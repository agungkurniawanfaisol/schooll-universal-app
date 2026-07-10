import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { ChevronDown, GraduationCap, Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { PublicNavTree } from '@/components/layout/PublicNavTree'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  isNavBranchActive,
  isNavItemActive,
  isRouteLink,
  resolvePublicNav,
  type PublicNavItem,
} from '@/config/publicNav'
import { useLandingContext } from '@/features/landing/LandingDataContext'
import { useTheme } from '@/hooks/useTheme'
import { springSnappy } from '@/lib/motion'
import { cn } from '@/lib/utils'

const navLinkClass =
  'relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300'

function NavMenuItem({
  item,
  pathname,
  hash,
}: {
  item: PublicNavItem
  pathname: string
  hash: string
}) {
  const isBranchActive = isNavBranchActive(pathname, hash, item)

  if (item.children?.length) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              navLinkClass,
              'inline-flex items-center gap-1',
              isBranchActive
                ? 'bg-primary/10 text-primary shadow-soft'
                : 'text-muted-foreground hover:bg-accent/70 hover:text-foreground',
            )}
          >
            {item.label}
            <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform duration-300 group-data-[state=open]:rotate-180" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[12rem] border-primary/10 bg-card/95 backdrop-blur-xl">
          {item.children.map((child) =>
            child.href ? (
              <DropdownMenuItem key={child.id} asChild>
                {isRouteLink(child.href) ? (
                  <Link
                    to={child.href}
                    className={cn(
                      isNavItemActive(pathname, hash, child.href) && 'bg-primary/10 text-primary',
                    )}
                  >
                    {child.label}
                  </Link>
                ) : (
                  <a href={child.href}>{child.label}</a>
                )}
              </DropdownMenuItem>
            ) : null,
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (!item.href) return null

  const isActive = isNavItemActive(pathname, hash, item.href)
  const activeClass = isActive
    ? 'bg-primary/10 text-primary shadow-soft'
    : 'text-muted-foreground hover:bg-accent/70 hover:text-foreground'

  if (isRouteLink(item.href)) {
    return (
      <Link to={item.href} className={cn(navLinkClass, activeClass)}>
        {item.label}
      </Link>
    )
  }

  return (
    <a href={item.href} className={cn(navLinkClass, activeClass)}>
      {item.label}
    </a>
  )
}

export function PublicNavbar() {
  const { data, settings } = useLandingContext()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hash, setHash] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash : '',
  )
  const { toggleTheme, isDark } = useTheme()

  const navItems = useMemo(() => resolvePublicNav(data?.navigation), [data?.navigation])

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash)
    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      return
    }

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [mobileOpen])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b py-3.5 transition-[background-color,box-shadow,border-color,backdrop-filter,padding] duration-500',
          scrolled
            ? 'border-border/40 bg-[var(--glass)] py-3 shadow-soft backdrop-blur-xl'
            : 'border-transparent bg-background/40 backdrop-blur-md',
        )}
      >
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] origin-left gradient-bg shadow-glow"
          style={{ scaleX }}
          aria-hidden
        />

        <div className="container mx-auto flex items-center justify-between gap-4 px-4 lg:px-8">
          <Link to="/" className="group flex min-w-0 items-center gap-2.5">
            {settings.schoolLogo ? (
              <img
                src={settings.schoolLogo}
                alt=""
                className="h-10 w-10 rounded-xl object-cover ring-1 ring-primary/10 transition-all duration-300 group-hover:ring-primary/30 group-hover:shadow-glow"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg text-primary-foreground shadow-soft transition-all duration-300 group-hover:shadow-glow">
                <GraduationCap className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0">
              <span className="block max-w-[140px] truncate text-lg font-bold tracking-tight transition-colors group-hover:text-primary sm:max-w-none sm:whitespace-normal">
                {settings.schoolName}
              </span>
              <p className="max-w-[140px] truncate text-[10px] text-muted-foreground sm:max-w-none sm:whitespace-normal">
                {settings.schoolTagline}
              </p>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
            {navItems.map((item) => (
              <NavMenuItem
                key={item.id}
                item={item}
                pathname={location.pathname}
                hash={hash}
              />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-full transition-colors hover:bg-primary/10"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {settings.ppdbUrl ? (
              <Button variant="outline" size="sm" className="hidden rounded-full border-primary/25 sm:inline-flex" asChild>
                <a href={settings.ppdbUrl}>PPDB</a>
              </Button>
            ) : null}
            <Button variant="gradient" size="sm" className="hidden rounded-full shadow-glow sm:inline-flex" asChild>
              <Link to="/login">Portal Admin</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              aria-label="Tutup menu"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={springSnappy}
              className="fixed inset-y-0 left-0 z-50 flex w-[min(88vw,300px)] flex-col border-r border-primary/10 bg-gradient-to-b from-card via-card to-muted/30 shadow-glow backdrop-blur-xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-border/50 px-4 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{settings.schoolName}</p>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-primary">Menu</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Tutup menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4">
                <PublicNavTree
                  items={navItems}
                  variant="drawer"
                  onNavigate={() => setMobileOpen(false)}
                />
              </div>

              <div className="space-y-2 border-t border-border/50 p-4">
                {settings.ppdbUrl ? (
                  <Button variant="outline" className="min-h-11 w-full rounded-full" asChild>
                    <a href={settings.ppdbUrl} onClick={() => setMobileOpen(false)}>
                      Daftar PPDB
                    </a>
                  </Button>
                ) : null}
                <Button variant="gradient" className="min-h-11 w-full rounded-full shadow-glow" asChild>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    Portal Admin
                  </Link>
                </Button>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}
