import { Outlet } from 'react-router-dom'

import { PublicFooter } from '@/components/layout/PublicFooter'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { LandingDataProvider } from '@/features/landing/LandingDataContext'
import { LandingFloatingActions } from '@/features/landing/LandingFloatingActions'

export function PublicLayout() {
  return (
    <LandingDataProvider>
      <div className="surface-page min-h-screen">
        <PublicNavbar />
        <main>
          <Outlet />
        </main>
        <PublicFooter />
        <LandingFloatingActions />
      </div>
    </LandingDataProvider>
  )
}
