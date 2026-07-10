import { create } from 'zustand'

type ToastVariant = 'default' | 'destructive' | 'success'

export interface ToastItem {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface NotificationState {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
}

let toastCounter = 0

export const useNotificationStore = create<NotificationState>((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${++toastCounter}`
    const duration = toast.duration ?? 5000
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    if (duration > 0) {
      setTimeout(() => get().removeToast(id), duration)
    }
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  success: (title, description) =>
    get().addToast({ title, description, variant: 'success' }),
  error: (title, description) =>
    get().addToast({ title, description, variant: 'destructive' }),
}))
