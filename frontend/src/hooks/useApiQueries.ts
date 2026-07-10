import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { unwrapApiData, type ApiRecord } from '@/api/utils'
import type { ApiResponse } from '@/types/api'

export interface LandingData {
  hero: ApiRecord[]
  about: ApiRecord | null
  vision_mission: ApiRecord[]
  principal_message: ApiRecord | null
  teachers: ApiRecord[]
  activities: ApiRecord[]
  agendas: ApiRecord[]
  galleries: ApiRecord[]
  testimonials: ApiRecord[]
  facilities: ApiRecord[]
  achievements: ApiRecord[]
  news: ApiRecord[]
  contact_info: ApiRecord[]
  social_media: ApiRecord[]
  navigation: ApiRecord[]
  footer: ApiRecord | null
  settings?: ApiRecord
  seo?: ApiRecord | null
}

export function useLandingData() {
  return useQuery({
    queryKey: ['public', 'landing'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<LandingData>>(endpoints.public.landing)
      return unwrapApiData(response)
    },
    staleTime: 1000 * 60 * 5,
  })
}

export interface DashboardData {
  stats: {
    users: number
    teachers: number
    activities: number
    agendas: number
    news: number
    unread_contacts: number
  }
  recent_news: ApiRecord[]
  upcoming_agendas: ApiRecord[]
}

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<DashboardData>>(endpoints.dashboard.index)
      return unwrapApiData(response)
    },
  })
}

export function useRolesList() {
  return useQuery({
    queryKey: ['roles', 'all'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ApiRecord[]>>(endpoints.roles.list, {
        params: { all: 1 },
      })
      return unwrapApiData(response)
    },
  })
}

export function usePermissionsList() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ApiRecord[]>>(endpoints.permissions.list)
      return unwrapApiData(response)
    },
  })
}
