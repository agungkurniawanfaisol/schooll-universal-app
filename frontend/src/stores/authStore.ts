import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { User } from '@/types/auth'

interface AuthState {
  token: string | null
  refreshToken: string | null
  user: User | null
  permissions: string[]
  isAuthenticated: boolean
  setAuth: (token: string, refreshToken: string, user: User) => void
  setTokens: (token: string, refreshToken: string) => void
  setUser: (user: User) => void
  logout: () => void
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      permissions: [],
      isAuthenticated: false,
      setAuth: (token, refreshToken, user) =>
        set({
          token,
          refreshToken,
          user,
          permissions: user.permissions ?? user.role?.permissions ?? [],
          isAuthenticated: true,
        }),
      setTokens: (token, refreshToken) => set({ token, refreshToken }),
      setUser: (user) =>
        set({
          user,
          permissions: user.permissions ?? user.role?.permissions ?? [],
        }),
      logout: () =>
        set({
          token: null,
          refreshToken: null,
          user: null,
          permissions: [],
          isAuthenticated: false,
        }),
      hasPermission: (permission) => get().permissions.includes(permission),
      hasAnyPermission: (permissions) =>
        permissions.some((p) => get().permissions.includes(p)),
    }),
    { name: 'sekolah-auth' },
  ),
)
