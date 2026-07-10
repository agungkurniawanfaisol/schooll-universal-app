import { Navigate } from 'react-router-dom'

import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useAuthStore } from '@/stores/authStore'

interface PermissionRouteProps {
  children: React.ReactNode
  permissions: string[]
  requireAll?: boolean
}

export function PermissionRoute({
  children,
  permissions,
  requireAll = false,
}: PermissionRouteProps) {
  const { isAuthenticated, hasPermission, hasAnyPermission } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const allowed = requireAll
    ? permissions.every((p) => hasPermission(p))
    : hasAnyPermission(permissions)

  if (!allowed) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner label="Anda tidak memiliki akses ke halaman ini" />
      </div>
    )
  }

  return <>{children}</>
}
