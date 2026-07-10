import { GraduationCap } from 'lucide-react'
import { Outlet } from 'react-router-dom'

import { useSchoolName } from '@/hooks/useSchoolName'

export function AuthLayout() {
  const schoolName = useSchoolName()

  return (
    <div className="surface-page relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full glow-primary opacity-50 blur-3xl dark:opacity-100" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full glow-accent opacity-50 blur-3xl dark:opacity-100" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl dark:bg-primary/5" />
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-bg text-primary-foreground shadow-glow">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{schoolName}</h1>
            <p className="text-sm text-muted-foreground">Panel Administrasi CMS</p>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
