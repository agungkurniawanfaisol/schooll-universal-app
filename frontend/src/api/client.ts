import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { endpoints } from '@/api/endpoints'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import type { ApiError, ApiResponse, RefreshTokenResponse } from '@/types/api'

const apiClient = axios.create({
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else if (token) prom.resolve(token)
  })
  failedQueue = []
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(apiClient(originalRequest))
            },
            reject,
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const token = useAuthStore.getState().token
      if (!token) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post<ApiResponse<RefreshTokenResponse>>(
          endpoints.auth.refresh,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        const newToken = data.data.token
        useAuthStore.getState().setTokens(newToken, newToken)
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    const message =
      error.response?.data?.message ?? error.message ?? 'Terjadi kesalahan'
    if (error.response?.status !== 401) {
      useNotificationStore.getState().error('Error', message)
    }

    return Promise.reject(error)
  },
)

export { apiClient }
