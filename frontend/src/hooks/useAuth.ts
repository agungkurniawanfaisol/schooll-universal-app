import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { mapUserFromApi } from '@/api/mappers'
import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { unwrapApiData, type ApiRecord } from '@/api/utils'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import type { ApiResponse } from '@/types/api'
import type { LoginFormData } from '@/validators/auth'

export function useAuth() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout: storeLogout, setAuth, hasPermission, hasAnyPermission } =
    useAuthStore()
  const { success, error } = useNotificationStore()

  const login = useCallback(
    async (data: LoginFormData) => {
      try {
        const response = await apiClient.post<ApiResponse<{ token: string; user: ApiRecord }>>(
          endpoints.auth.login,
          data,
        )
        const payload = unwrapApiData(response)
        const token = String(payload.token)
        const loggedInUser = mapUserFromApi(payload.user)
        setAuth(token, token, loggedInUser)
        success('Berhasil masuk', `Selamat datang, ${loggedInUser.name}`)
        navigate('/dashboard')
      } catch {
        error('Gagal masuk', 'Email atau password salah')
      }
    },
    [setAuth, navigate, success, error],
  )

  const logout = useCallback(async () => {
    try {
      await apiClient.post(endpoints.auth.logout)
    } catch {
      // ignore logout errors
    } finally {
      storeLogout()
      navigate('/login')
    }
  }, [storeLogout, navigate])

  return {
    user,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
  }
}
