import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { mapPaginationMeta, type ApiRecord, type PaginatedResult } from '@/api/utils'
import type { ApiResponse } from '@/types/api'

export interface PublicListParams {
  page?: number
  perPage?: number
  search?: string
  dateFrom?: string
  dateTo?: string
}

function toPublicQueryParams(params: PublicListParams): Record<string, string | number> {
  const query: Record<string, string | number> = {}
  if (params.page) query.page = params.page
  if (params.perPage) query.per_page = params.perPage
  if (params.search) query.search = params.search
  if (params.dateFrom) query.date_from = params.dateFrom
  if (params.dateTo) query.date_to = params.dateTo
  return query
}

async function fetchPublicList(
  url: string,
  params: PublicListParams,
): Promise<PaginatedResult<ApiRecord>> {
  const response = await apiClient.get<
    ApiResponse<ApiRecord[]> & {
      meta?: {
        current_page?: number
        last_page?: number
        per_page?: number
        total?: number
      }
    }
  >(url, { params: toPublicQueryParams(params) })

  return {
    items: response.data.data ?? [],
    meta: mapPaginationMeta(response.data.meta),
  }
}

async function fetchPublicDetail(url: string): Promise<ApiRecord | undefined> {
  const response = await apiClient.get<ApiResponse<ApiRecord>>(url)
  return response.data.data
}

export function usePublicNewsList(params: PublicListParams) {
  return useQuery({
    queryKey: ['public', 'news', 'list', params],
    queryFn: () => fetchPublicList(endpoints.public.news, params),
  })
}

export function usePublicAgendaList(params: PublicListParams) {
  return useQuery({
    queryKey: ['public', 'agendas', 'list', params],
    queryFn: () => fetchPublicList(endpoints.public.agendas, params),
  })
}

export function usePublicTeachersList(params: PublicListParams) {
  return useQuery({
    queryKey: ['public', 'teachers', 'list', params],
    queryFn: () => fetchPublicList(endpoints.public.teachers, params),
  })
}

export function usePublicActivitiesList(params: PublicListParams) {
  return useQuery({
    queryKey: ['public', 'activities', 'list', params],
    queryFn: () => fetchPublicList(endpoints.public.activities, params),
  })
}

export function usePublicGalleriesList(params: PublicListParams) {
  return useQuery({
    queryKey: ['public', 'galleries', 'list', params],
    queryFn: () => fetchPublicList(endpoints.public.galleries, params),
  })
}

export function usePublicTestimonialsList(params: PublicListParams) {
  return useQuery({
    queryKey: ['public', 'testimonials', 'list', params],
    queryFn: () => fetchPublicList(endpoints.public.testimonials, params),
  })
}

export function usePublicFacilitiesList(params: PublicListParams) {
  return useQuery({
    queryKey: ['public', 'facilities', 'list', params],
    queryFn: () => fetchPublicList(endpoints.public.facilities, params),
  })
}

export function usePublicAchievementsList(params: PublicListParams) {
  return useQuery({
    queryKey: ['public', 'achievements', 'list', params],
    queryFn: () => fetchPublicList(endpoints.public.achievements, params),
  })
}

export function usePublicVisionMission() {
  return useQuery({
    queryKey: ['public', 'vision-mission'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ApiRecord[]>>(endpoints.public.visionMission)
      return response.data.data ?? []
    },
  })
}

export function usePublicNews(slug: string) {
  return useQuery({
    queryKey: ['public', 'news', slug],
    queryFn: () => fetchPublicDetail(endpoints.public.newsDetail(slug)),
    enabled: Boolean(slug),
  })
}

export function usePublicAgenda(slug: string) {
  return useQuery({
    queryKey: ['public', 'agendas', slug],
    queryFn: () => fetchPublicDetail(endpoints.public.agendaDetail(slug)),
    enabled: Boolean(slug),
  })
}

export function usePublicTeacher(slug: string) {
  return useQuery({
    queryKey: ['public', 'teachers', slug],
    queryFn: () => fetchPublicDetail(endpoints.public.teacherDetail(slug)),
    enabled: Boolean(slug),
  })
}

export function usePublicActivity(slug: string) {
  return useQuery({
    queryKey: ['public', 'activities', slug],
    queryFn: () => fetchPublicDetail(endpoints.public.activityDetail(slug)),
    enabled: Boolean(slug),
  })
}

export function usePublicGallery(slug: string) {
  return useQuery({
    queryKey: ['public', 'galleries', slug],
    queryFn: () => fetchPublicDetail(endpoints.public.galleryDetail(slug)),
    enabled: Boolean(slug),
  })
}

export function usePublicFacility(slug: string) {
  return useQuery({
    queryKey: ['public', 'facilities', slug],
    queryFn: () => fetchPublicDetail(endpoints.public.facilityDetail(slug)),
    enabled: Boolean(slug),
  })
}

export function usePublicAchievement(slug: string) {
  return useQuery({
    queryKey: ['public', 'achievements', slug],
    queryFn: () => fetchPublicDetail(endpoints.public.achievementDetail(slug)),
    enabled: Boolean(slug),
  })
}
