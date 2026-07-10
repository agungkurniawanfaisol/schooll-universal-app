import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ExternalLink, GraduationCap, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

import { dashboardNavTree } from '@/config/dashboardNav'
import { AppVersionBadge } from '@/components/common/AppVersionBadge'
import { SidebarNavTree } from '@/components/layout/SidebarNavTree'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useSidebarStore } from '@/stores/sidebarStore'
import { springSnappy } from '@/lib/motion'
import { cn } from '@/lib/utils'

import { DEFAULT_SCHOOL_NAME } from '@/config/schoolDefaults'
import { useGeneralSettings } from '@/hooks/useSettingsApi'

interface DashboardSidebarProps {
  className?: string
}

function SidebarPanel({ onNavigate, showCollapse = true }: { onNavigate?: () => void; showCollapse?: boolean }) {
  const { isCollapsed, toggleCollapsed } = useSidebarStore()
  const { data: generalSettings } = useGeneralSettings()
  const schoolName = generalSettings?.schoolName || DEFAULT_SCHOOL_NAME

  return (
    <div className="flex h-full flex-col">
      <div className={cn('relative overflow-hidden pb-4 pt-5', isCollapsed ? 'px-2' : 'px-4')}>
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
        <Link
          to="/dashboard"
          onClick={onNavigate}
          className={cn('relative flex items-center gap-3', isCollapsed && 'justify-center')}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-bg text-primary-foreground shadow-glow">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-tight">{schoolName}</p>
              <p className="text-[11px] text-muted-foreground">Panel Administrasi CMS</p>
            </div>
          )}
        </Link>
      </div>

      <Separator className="opacity-60" />

      <nav className={cn('flex-1 overflow-y-auto overflow-x-visible py-4 scrollbar-thin', isCollapsed ? 'px-2' : 'px-3')}>
        <SidebarNavTree items={dashboardNavTree} onNavigate={onNavigate} />
      </nav>

      <div className={cn('border-t border-border/60', isCollapsed ? 'p-2 pb-3' : 'p-3 pb-4')}>
        {!isCollapsed && (
          <Link
            to="/"
            target="_blank"
            className="mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent/80 hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Lihat Website Publik
          </Link>
        )}

        <AppVersionBadge collapsed={isCollapsed} className={isCollapsed ? 'mb-2' : 'mb-3'} />

        {showCollapse && (
          <Button
            variant="ghost"
            size={isCollapsed ? 'icon' : 'sm'}
            onClick={toggleCollapsed}
            className={cn(
              'text-muted-foreground',
              isCollapsed ? 'mx-auto h-11 w-11 rounded-xl' : 'w-full justify-start gap-2',
            )}
            aria-label={isCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4" />
                Ciutkan Sidebar
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const { isOpen, isCollapsed, setOpen } = useSidebarStore()

  return (
    <>
      {/* Desktop sidebar — floating card */}
      <aside
        className={cn(
          'fixed left-3 top-3 bottom-6 z-40 hidden overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-card via-card to-muted/20 shadow-soft transition-all duration-300 lg:flex lg:flex-col',
          isCollapsed ? 'w-[76px]' : 'w-[280px]',
          className,
        )}
      >
        <SidebarPanel />
      </aside>

      {/* Mobile overlay + drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              aria-label="Tutup menu"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={springSnappy}
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-border/60 bg-gradient-to-b from-card via-card to-muted/20 shadow-glow lg:hidden"
            >
              <div className="flex items-center justify-end p-2">
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Tutup sidebar">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
              <SidebarPanel onNavigate={() => setOpen(false)} showCollapse={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
