import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import {
  collectActiveBranchIds,
  isNavBranchActive,
  isNavItemActive,
  isRouteLink,
  type PublicNavItem,
} from '@/config/publicNav'
import { springSnappy } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface PublicNavTreeProps {
  items: PublicNavItem[]
  onNavigate?: () => void
  className?: string
  variant?: 'sidebar' | 'drawer'
}

function NavAnchor({
  href,
  label,
  isActive,
  depth,
  onNavigate,
}: {
  href: string
  label: string
  isActive: boolean
  depth: number
  onNavigate?: () => void
}) {
  const className = cn(
    'block rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300',
    depth > 0 && 'ml-3 border-l border-primary/15 pl-3',
    isActive
      ? 'bg-primary/10 text-primary shadow-soft'
      : 'text-muted-foreground hover:bg-accent/70 hover:text-foreground',
  )

  if (isRouteLink(href)) {
    return (
      <Link to={href} onClick={onNavigate} className={className}>
        {label}
      </Link>
    )
  }

  return (
    <a href={href} onClick={onNavigate} className={className}>
      {label}
    </a>
  )
}

function NavBranch({
  item,
  depth,
  expandedIds,
  toggleExpanded,
  pathname,
  hash,
  onNavigate,
}: {
  item: PublicNavItem
  depth: number
  expandedIds: Set<string>
  toggleExpanded: (id: string) => void
  pathname: string
  hash: string
  onNavigate?: () => void
}) {
  const isExpanded = expandedIds.has(item.id)
  const isActive = isNavBranchActive(pathname, hash, item)

  return (
    <div className={cn(depth > 0 && 'ml-1')}>
      <button
        type="button"
        onClick={() => toggleExpanded(item.id)}
        className={cn(
          'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300',
          isActive
            ? 'bg-primary/10 text-primary shadow-soft'
            : 'text-muted-foreground hover:bg-accent/70 hover:text-foreground',
        )}
        aria-expanded={isExpanded}
      >
        <span>{item.label}</span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 transition-transform', isExpanded && 'rotate-180')}
        />
      </button>
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springSnappy}
            className="overflow-hidden"
          >
            <div className="mt-1 space-y-0.5 pb-1">
              {item.children?.map((child) => (
                <PublicNavTreeNode
                  key={child.id}
                  item={child}
                  depth={depth + 1}
                  expandedIds={expandedIds}
                  toggleExpanded={toggleExpanded}
                  pathname={pathname}
                  hash={hash}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function PublicNavTreeNode({
  item,
  depth,
  expandedIds,
  toggleExpanded,
  pathname,
  hash,
  onNavigate,
}: {
  item: PublicNavItem
  depth: number
  expandedIds: Set<string>
  toggleExpanded: (id: string) => void
  pathname: string
  hash: string
  onNavigate?: () => void
}) {
  if (item.children?.length) {
    return (
      <NavBranch
        item={item}
        depth={depth}
        expandedIds={expandedIds}
        toggleExpanded={toggleExpanded}
        pathname={pathname}
        hash={hash}
        onNavigate={onNavigate}
      />
    )
  }

  if (!item.href) return null

  return (
    <NavAnchor
      href={item.href}
      label={item.label}
      depth={depth}
      isActive={isNavItemActive(pathname, hash, item.href)}
      onNavigate={onNavigate}
    />
  )
}

export function PublicNavTree({
  items,
  onNavigate,
  className,
  variant = 'sidebar',
}: PublicNavTreeProps) {
  const location = useLocation()
  const [hash, setHash] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash : '',
  )
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash)
    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [location.pathname])

  useEffect(() => {
    const activeIds = collectActiveBranchIds(location.pathname, hash, items)
    if (activeIds.length) {
      setExpandedIds((prev) => new Set([...prev, ...activeIds]))
    }
  }, [location.pathname, hash, items])

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <nav
      className={cn(
        'space-y-0.5',
        variant === 'sidebar' && 'text-sm',
        variant === 'drawer' && 'text-base',
        className,
      )}
      aria-label="Navigasi website"
    >
      {items.map((item) => (
        <PublicNavTreeNode
          key={item.id}
          item={item}
          depth={0}
          expandedIds={expandedIds}
          toggleExpanded={toggleExpanded}
          pathname={location.pathname}
          hash={hash}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  )
}
