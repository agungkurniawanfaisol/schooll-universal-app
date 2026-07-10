import { useEffect, useState } from 'react'

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { useNotificationStore } from '@/stores/notificationStore'

export function Toaster() {
  const { toasts, removeToast } = useNotificationStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          open={true}
          onOpenChange={(open) => {
            if (!open) removeToast(toast.id)
          }}
        >
          <div className="grid gap-1">
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && (
              <ToastDescription>{toast.description}</ToastDescription>
            )}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
