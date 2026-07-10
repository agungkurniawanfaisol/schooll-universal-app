import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { publishStatus, unwrapApiData, type ApiRecord } from '@/api/utils'
import type { ApiResponse } from '@/types/api'

function invalidateLanding(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['public', 'landing'] })
}

export function useHeroSections() {
  return useQuery({
    queryKey: ['content', 'hero'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ApiRecord[]>>(endpoints.content.hero)
      return unwrapApiData(response)
    },
  })
}

export function useSaveHeroSection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: ApiRecord }) => {
      const payload = {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        background_image: data.background_image || null,
        cta_text: data.cta_text,
        cta_url: data.cta_url,
        status: data.status ?? 'published',
        sort_order: data.sort_order ?? 0,
      }
      if (id) {
        const response = await apiClient.put<ApiResponse<ApiRecord>>(
          endpoints.content.heroUpdate(id),
          payload,
        )
        return unwrapApiData(response)
      }
      const response = await apiClient.post<ApiResponse<ApiRecord>>(endpoints.content.hero, payload)
      return unwrapApiData(response)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'hero'] })
      invalidateLanding(queryClient)
    },
  })
}

export function useDeleteHeroSection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(endpoints.content.heroDelete(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'hero'] })
      invalidateLanding(queryClient)
    },
  })
}

export function usePrincipal() {
  return useQuery({
    queryKey: ['content', 'principal'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ApiRecord | null>>(endpoints.content.principal)
      return unwrapApiData(response)
    },
  })
}

export function useSavePrincipal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ApiRecord) => {
      const response = await apiClient.put<ApiResponse<ApiRecord>>(endpoints.content.principal, {
        name: data.name,
        title: data.title,
        photo: data.photo || null,
        message: data.message,
        status: data.status ?? 'published',
      })
      return unwrapApiData(response)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'principal'] })
      invalidateLanding(queryClient)
    },
  })
}

export function useAboutSchool() {
  return useQuery({
    queryKey: ['content', 'about'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ApiRecord | null>>(endpoints.content.about)
      return unwrapApiData(response)
    },
  })
}

export function useSaveAboutSchool() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ApiRecord) => {
      const response = await apiClient.put<ApiResponse<ApiRecord>>(endpoints.content.about, {
        title: data.title,
        content: data.content,
        image: data.image || null,
        video_url: data.video_url || null,
        status: data.status ?? 'published',
      })
      return unwrapApiData(response)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'about'] })
      invalidateLanding(queryClient)
    },
  })
}

export function useVisionMission() {
  return useQuery({
    queryKey: ['content', 'vision-mission'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ApiRecord[]>>(
        endpoints.content.visionMission,
      )
      return unwrapApiData(response)
    },
  })
}

export function useSaveVisionMission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: ApiRecord }) => {
      const payload = {
        type: data.type,
        title: data.title,
        content: data.content,
        icon: data.icon,
        sort_order: data.sort_order ?? 0,
        status: data.status ?? 'published',
      }
      if (id) {
        const response = await apiClient.put<ApiResponse<ApiRecord>>(
          endpoints.content.visionMissionUpdate(id),
          payload,
        )
        return unwrapApiData(response)
      }
      const response = await apiClient.post<ApiResponse<ApiRecord>>(
        endpoints.content.visionMission,
        payload,
      )
      return unwrapApiData(response)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'vision-mission'] })
      invalidateLanding(queryClient)
    },
  })
}

export function useContactInfo() {
  return useQuery({
    queryKey: ['content', 'contact-info'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ApiRecord[]>>(endpoints.content.contactInfo)
      return unwrapApiData(response)
    },
  })
}

export function useSaveContactInfo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: ApiRecord }) => {
      const payload = {
        type: data.type,
        label: data.label,
        value: data.value,
        icon: data.icon,
        sort_order: data.sort_order ?? 0,
      }
      if (id) {
        const response = await apiClient.put<ApiResponse<ApiRecord>>(
          endpoints.content.contactInfoUpdate(id),
          payload,
        )
        return unwrapApiData(response)
      }
      const response = await apiClient.post<ApiResponse<ApiRecord>>(
        endpoints.content.contactInfo,
        payload,
      )
      return unwrapApiData(response)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'contact-info'] })
      invalidateLanding(queryClient)
    },
  })
}

export function useDeleteContactInfo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(endpoints.content.contactInfoDelete(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'contact-info'] })
      invalidateLanding(queryClient)
    },
  })
}

export function useSocialMedia() {
  return useQuery({
    queryKey: ['content', 'social-media'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ApiRecord[]>>(endpoints.content.socialMedia)
      return unwrapApiData(response)
    },
  })
}

export function useSaveSocialMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: ApiRecord }) => {
      const payload = {
        platform: data.platform,
        url: data.url,
        icon: data.icon ?? data.platform,
        sort_order: data.sort_order ?? 0,
        is_active: data.is_active ?? true,
      }
      if (id) {
        const response = await apiClient.put<ApiResponse<ApiRecord>>(
          endpoints.content.socialMediaUpdate(id),
          payload,
        )
        return unwrapApiData(response)
      }
      const response = await apiClient.post<ApiResponse<ApiRecord>>(
        endpoints.content.socialMedia,
        payload,
      )
      return unwrapApiData(response)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'social-media'] })
      invalidateLanding(queryClient)
    },
  })
}

export function useDeleteSocialMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(endpoints.content.socialMediaDelete(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'social-media'] })
      invalidateLanding(queryClient)
    },
  })
}

export function useNavigation() {
  return useQuery({
    queryKey: ['content', 'navigation'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ApiRecord[]>>(endpoints.content.navigation)
      return unwrapApiData(response)
    },
  })
}

export function useSaveNavigation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: ApiRecord }) => {
      const payload = {
        label: data.label,
        url: data.url,
        sort_order: data.sort_order ?? 0,
        is_external: data.is_external ?? false,
      }
      if (id) {
        const response = await apiClient.put<ApiResponse<ApiRecord>>(
          endpoints.content.navigationUpdate(id),
          payload,
        )
        return unwrapApiData(response)
      }
      const response = await apiClient.post<ApiResponse<ApiRecord>>(
        endpoints.content.navigation,
        payload,
      )
      return unwrapApiData(response)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'navigation'] })
      invalidateLanding(queryClient)
    },
  })
}

export function useDeleteNavigation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(endpoints.content.navigationDelete(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'navigation'] })
      invalidateLanding(queryClient)
    },
  })
}

export function useFooter() {
  return useQuery({
    queryKey: ['content', 'footer'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ApiRecord | null>>(endpoints.content.footer)
      return unwrapApiData(response)
    },
  })
}

export function useSaveFooter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ApiRecord) => {
      const response = await apiClient.put<ApiResponse<ApiRecord>>(endpoints.content.footer, {
        copyright_text: data.copyright_text,
        description: data.description,
        logo: data.logo || null,
        status: data.status ?? 'published',
      })
      return unwrapApiData(response)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'footer'] })
      invalidateLanding(queryClient)
    },
  })
}

export function useSeoHome() {
  return useQuery({
    queryKey: ['seo', 'home'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<ApiResponse<ApiRecord>>(endpoints.seo.detail('home'))
        return unwrapApiData(response)
      } catch {
        return null
      }
    },
  })
}

export function useSaveSeoHome() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ApiRecord) => {
      const payload = {
        page_key: 'home',
        title: data.title,
        description: data.description,
        keywords: data.keywords,
        og_title: data.og_title,
        og_description: data.og_description,
        og_image: data.og_image || null,
      }
      try {
        const response = await apiClient.put<ApiResponse<ApiRecord>>(
          endpoints.seo.update('home'),
          payload,
        )
        return unwrapApiData(response)
      } catch {
        const response = await apiClient.post<ApiResponse<ApiRecord>>(endpoints.seo.create, payload)
        return unwrapApiData(response)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo', 'home'] })
      invalidateLanding(queryClient)
    },
  })
}

export { publishStatus }
