import { Outlet } from 'react-router-dom'

import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { Modal } from '@/components/ui/modal'
import { useModalStore } from '@/stores/modalStore'
import { useSidebarStore } from '@/stores/sidebarStore'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const { isCollapsed } = useSidebarStore()
  const { isOpen, title, content, size, closeModal } = useModalStore()

  return (
    <div className="surface-page min-h-screen">
      <DashboardSidebar />
      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300',
          isCollapsed ? 'lg:ml-[100px]' : 'lg:ml-[304px]',
        )}
      >
        <DashboardHeader />
        <main className="scroll-smooth-touch flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <Modal open={isOpen} onOpenChange={(open) => !open && closeModal()} title={title} size={size}>
        {content}
      </Modal>
    </div>
  )
}
