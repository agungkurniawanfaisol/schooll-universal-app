import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { mapWebsiteSettings } from '@/api/contentMappers'
import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { unwrapApiData, type ApiRecord } from '@/api/utils'
import { useAuthStore } from '@/stores/authStore'
import type { ApiResponse } from '@/types/api'
import type { LandingData } from '@/hooks/useApiQueries'

export interface HeroStat {
  label: string
  value: number
  suffix: string
}

export interface GeneralSettingsForm {
  schoolName: string
  schoolTagline: string
  schoolLogo: string
  ppdbUrl: string
  heroStats: HeroStat[]
}

export function useGeneralSettings(options?: { enabled?: boolean }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: ['settings', 'general'],
    queryFn: async () => {
      const [generalRes, heroRes] = await Promise.all([
        apiClient.get<ApiResponse<ApiRecord[]>>(endpoints.settings.list, {
          params: { group: 'general' },
        }),
        apiClient.get<ApiResponse<ApiRecord[]>>(endpoints.settings.list, {
          params: { group: 'hero' },
        }),
      ])
      return mapWebsiteSettings([
        ...unwrapApiData(generalRes),
        ...unwrapApiData(heroRes),
      ])
    },
    enabled: options?.enabled ?? isAuthenticated,
    staleTime: 0,
  })
}

async function upsertSetting(key: string, value: unknown, group = 'general') {
  await apiClient.post(endpoints.settings.upsert, { key, value, group })
}

export function useSaveGeneralSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (form: GeneralSettingsForm) => {
      await Promise.all([
        upsertSetting('school_name', { text: form.schoolName }),
        upsertSetting('school_tagline', { text: form.schoolTagline }),
        upsertSetting('school_logo', { url: form.schoolLogo || null }),
        upsertSetting('ppdb_url', { url: form.ppdbUrl || null }),
        upsertSetting('hero_stats', form.heroStats, 'hero'),
      ])
    },
    onSuccess: (_data, form) => {
      queryClient.setQueryData(['settings', 'general'], form)
      queryClient.setQueryData<LandingData>(['public', 'landing'], (current) => {
        if (!current) return current
        return {
          ...current,
          settings: {
            ...(current.settings ?? {}),
            school_name: form.schoolName,
            school_tagline: form.schoolTagline,
            school_logo: form.schoolLogo,
            ppdb_url: form.ppdbUrl,
            hero_stats: form.heroStats,
          },
        }
      })
      queryClient.invalidateQueries({ queryKey: ['settings', 'general'] })
      queryClient.invalidateQueries({ queryKey: ['public', 'landing'] })
    },
  })
}
