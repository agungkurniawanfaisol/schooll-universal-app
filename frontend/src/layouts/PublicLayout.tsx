import { Outlet, useLocation } from 'react-router-dom'

import { PublicFooter } from '@/components/layout/PublicFooter'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { LandingDataProvider } from '@/features/landing/LandingDataContext'
import { LandingFloatingActions } from '@/features/landing/LandingFloatingActions'
import { LandingSplashScreen } from '@/features/landing/LandingSplashScreen'

function PublicLayoutContent() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      {isHome ? <LandingSplashScreen /> : null}
      <div className="surface-page min-h-screen">
        <PublicNavbar />
        <main>
          <Outlet />
        </main>
        <PublicFooter />
        <LandingFloatingActions />
      </div>
    </>
  )
}

export function PublicLayout() {
  return (
    <LandingDataProvider>
      <PublicLayoutContent />
    </LandingDataProvider>
  )
}
