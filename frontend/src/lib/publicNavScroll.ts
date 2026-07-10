import type { MouseEvent } from 'react'

const NAVBAR_OFFSET = 80

export function parseHashHref(href: string): { pathname: string; hash: string | null } {
  const hashIndex = href.indexOf('#')
  if (hashIndex === -1) {
    return { pathname: href || '/', hash: null }
  }

  return {
    pathname: href.slice(0, hashIndex) || '/',
    hash: href.slice(hashIndex + 1) || null,
  }
}

export function scrollToSection(hash: string): boolean {
  const el = document.getElementById(hash)
  if (!el) return false

  const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  return true
}

/** Smooth in-page hash navigation without layout jump from native anchor behavior. */
export function navigateToPublicHref(
  href: string,
  options?: { onNavigate?: () => void },
): boolean {
  const { pathname, hash } = parseHashHref(href)
  if (!hash) return false

  const currentPath = window.location.pathname
  const targetPath = pathname || '/'

  if (targetPath !== currentPath) return false

  if (!scrollToSection(hash)) return false

  const url = `${pathname === '/' ? '/' : pathname}#${hash}`
  window.history.replaceState(null, '', url)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
  options?.onNavigate?.()
  return true
}

export function handlePublicNavClick(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
  onNavigate?: () => void,
): void {
  if (navigateToPublicHref(href, { onNavigate })) {
    event.preventDefault()
    return
  }

  onNavigate?.()
}
