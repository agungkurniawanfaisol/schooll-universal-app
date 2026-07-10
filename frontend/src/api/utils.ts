import type { ApiResponse, ListParams, PaginationMeta } from '@/types/api'

export type ApiRecord = Record<string, unknown>

export interface PaginatedResult<T> {
  items: T[]
  meta: PaginationMeta
}

export function unwrapApiData<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data
}

export function toListQueryParams(params: ListParams): Record<string, string | number> {
  const query: Record<string, string | number> = {}

  if (params.page) query.page = params.page
  if (params.perPage) query.per_page = params.perPage
  if (params.search) query.search = params.search
  if (params.sortBy) query.sort = params.sortBy
  if (params.sortOrder) query.direction = params.sortOrder

  Object.entries(params).forEach(([key, value]) => {
    if (['page', 'perPage', 'search', 'sortBy', 'sortOrder'].includes(key)) return
    if (value !== undefined && value !== '') {
      const apiKey = key === 'dateFrom' ? 'date_from' : key === 'dateTo' ? 'date_to' : key
      query[apiKey] = value as string | number
    }
  })

  return query
}

export function mapPaginationMeta(meta?: {
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
}): PaginationMeta {
  return {
    page: meta?.current_page ?? 1,
    perPage: meta?.per_page ?? 15,
    total: meta?.total ?? 0,
    totalPages: meta?.last_page ?? 1,
  }
}

export function parsePaginatedResponse<T>(
  response: {
    data: ApiResponse<T[]> & {
      meta?: {
        current_page?: number
        last_page?: number
        per_page?: number
        total?: number
      }
    }
  },
  mapper: (item: ApiRecord) => T,
): PaginatedResult<T> {
  const rawItems = response.data.data ?? []
  return {
    items: rawItems.map((item) => mapper(item as ApiRecord)),
    meta: mapPaginationMeta(response.data.meta),
  }
}

export function publishStatus(isPublished: boolean): 'published' | 'draft' {
  return isPublished ? 'published' : 'draft'
}

export function isPublishedStatus(status: unknown): boolean {
  return status === 'published'
}

export function formatDate(value: unknown): string {
  if (!value) return '-'
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('id-ID')
}

export function toId(value: unknown): string {
  return String(value ?? '')
}
