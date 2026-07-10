import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'

import {
  collectExpandedGroupIds,
  isNavBranchActive,
  isNavItemActive,
  type DashboardNavItem,
} from '@/config/dashboardNav'
import { useSidebarStore } from '@/stores/sidebarStore'
import { springSnappy } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface SidebarNavTreeProps {
  items: DashboardNavItem[]
  depth?: number
  onNavigate?: () => void
}

function useHoverMenu(delayMs = 150) {
  const [open, setOpen] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setOpen(true)
  }

  const closeMenu = () => {
    closeTimerRef.current = setTimeout(() => setOpen(false), delayMs)
  }

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    },
    [],
  )

  return { open, setOpen, openMenu, closeMenu, cancelClose }
}

function CollapsedHoverLabel({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  const triggerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const getPosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return { top: 0, left: 0 }
    return { top: rect.top + rect.height / 2, left: rect.right + 10 }
  }

  return (
    <>
      <div
        ref={triggerRef}
        className="flex justify-center"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </div>

      {open &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[200] -translate-y-1/2 whitespace-nowrap rounded-lg border border-border bg-popover px-3 py-1.5 text-sm font-medium text-popover-foreground shadow-soft"
            style={getPosition()}
          >
            {label}
          </div>,
          document.body,
        )}
    </>
  )
}

function NavLink({
  item,
  depth,
  isCollapsed,
  onNavigate,
}: {
  item: DashboardNavItem
  depth: number
  isCollapsed: boolean
  onNavigate?: () => void
}) {
  const location = useLocation()
  const isActive = item.href ? isNavItemActive(location.pathname, item.href) : false
  const Icon = item.icon

  const link = (
    <Link
      to={item.href ?? '#'}
      onClick={onNavigate}
      className={cn(
        'group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200',
        depth > 0 ? 'w-full py-2 pl-3 pr-3' : 'px-3 py-2.5',
        isCollapsed && depth === 0 && 'mx-auto h-11 w-11 justify-center px-0',
        isActive
          ? isCollapsed && depth === 0
            ? 'bg-primary/15 text-primary ring-1 ring-primary/25 shadow-soft'
            : 'bg-primary/15 text-primary shadow-[inset_3px_0_0_0_var(--color-primary)]'
          : 'text-muted-foreground hover:bg-accent/80 hover:text-foreground',
      )}
    >
      <Icon
        className={cn(
          'h-4 w-4 shrink-0 transition-colors',
          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
        )}
      />
      {!isCollapsed || depth > 0 ? (
        <span className="min-w-0 flex-1 truncate text-foreground">{item.label}</span>
      ) : null}
      {isActive && (!isCollapsed || depth > 0) && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
      )}
    </Link>
  )

  if (isCollapsed && depth === 0) {
    return <CollapsedHoverLabel label={item.label}>{link}</CollapsedHoverLabel>
  }

  return link
}

function CollapsedNavBranch({
  item,
  isActive,
  onNavigate,
}: {
  item: DashboardNavItem
  isActive: boolean
  onNavigate?: () => void
}) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { open, openMenu, closeMenu, cancelClose } = useHoverMenu()
  const Icon = item.icon

  const getFlyoutPosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return { top: 0, left: 0 }
    return { top: rect.top, left: rect.right + 8 }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={item.label}
        aria-expanded={open}
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
        onFocus={openMenu}
        className={cn(
          'mx-auto flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200',
          isActive
            ? 'bg-primary/15 text-primary ring-1 ring-primary/25 shadow-soft'
            : 'text-muted-foreground hover:bg-accent/80 hover:text-foreground',
        )}
      >
        <Icon className="h-4 w-4" />
      </button>

      {open &&
        createPortal(
          <div
            className="fixed z-[200]"
            style={getFlyoutPosition()}
            onMouseEnter={cancelClose}
            onMouseLeave={closeMenu}
          >
            <div className="min-w-[240px] rounded-xl border border-border/60 bg-popover p-2 shadow-glow">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-foreground/80">
                {item.label}
              </p>
              <ul className="space-y-0.5">
                {item.children?.map((child) => (
                  <li key={child.id}>
                    <SidebarNavTree items={[child]} depth={1} onNavigate={onNavigate} />
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}

function NavBranch({
  item,
  depth,
  isCollapsed,
  onNavigate,
}: {
  item: DashboardNavItem
  depth: number
  isCollapsed: boolean
  onNavigate?: () => void
}) {
  const location = useLocation()
  const { expandedGroups, toggleGroup } = useSidebarStore()

  const hasChildren = Boolean(item.children?.length)
  const isExpanded = expandedGroups.includes(item.id)
  const isActive = isNavBranchActive(location.pathname, item)
  const Icon = item.icon

  if (!hasChildren) {
    return <NavLink item={item} depth={depth} isCollapsed={isCollapsed} onNavigate={onNavigate} />
  }

  if (isCollapsed && depth === 0) {
    return <CollapsedNavBranch item={item} isActive={isActive} onNavigate={onNavigate} />
  }

  return (
    <div className={cn(depth > 0 && 'space-y-0.5')}>
      <button
        type="button"
        onClick={() => toggleGroup(item.id)}
        className={cn(
          'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent/80 hover:text-foreground',
        )}
      >
        <Icon
          className={cn(
            'h-4 w-4 shrink-0',
            isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
          )}
        />
        <span className="flex-1 truncate text-left">{item.label}</span>
        <motion.span
          animate={{ rotate: isExpanded ? 0 : -90 }}
          transition={springSnappy}
          className="text-muted-foreground"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springSnappy}
            className="overflow-hidden"
          >
            <ul className="relative mt-1 space-y-0.5 pl-3">
              <span
                className="absolute bottom-2 left-[1.125rem] top-2 w-px bg-border/80"
                aria-hidden
              />
              {item.children?.map((child) => (
                <li key={child.id} className="relative">
                  <span
                    className="absolute left-[1.125rem] top-1/2 h-px w-3 -translate-y-1/2 bg-border/80"
                    aria-hidden
                  />
                  <SidebarNavTree items={[child]} depth={depth + 1} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function SidebarNavTree({ items, depth = 0, onNavigate }: SidebarNavTreeProps) {
  const location = useLocation()
  const { isCollapsed, ensureExpanded } = useSidebarStore()

  useEffect(() => {
    ensureExpanded(collectExpandedGroupIds(location.pathname))
  }, [location.pathname, ensureExpanded])

  return (
    <ul className={cn('space-y-1', depth === 0 && (isCollapsed ? 'space-y-2' : 'space-y-1.5'))}>
      {items.map((item) => (
        <li key={item.id}>
          {item.children?.length ? (
            <NavBranch item={item} depth={depth} isCollapsed={isCollapsed} onNavigate={onNavigate} />
          ) : (
            <NavLink item={item} depth={depth} isCollapsed={isCollapsed} onNavigate={onNavigate} />
          )}
        </li>
      ))}
    </ul>
  )
}
