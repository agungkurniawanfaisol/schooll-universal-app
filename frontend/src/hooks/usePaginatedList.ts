import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'

import { apiClient } from '@/api/client'
import {
  parsePaginatedResponse,
  toListQueryParams,
  unwrapApiData,
  type ApiRecord,
  type PaginatedResult,
} from '@/api/utils'
import type { ApiResponse, ListParams } from '@/types/api'

interface UsePaginatedListOptions<T> {
  queryKey: string
  listUrl: string
  bulkDeleteUrl?: string
  mapper: (item: ApiRecord) => T
  initialPerPage?: number
  extraParams?: Record<string, string | number>
}

export function usePaginatedList<T>({
  queryKey,
  listUrl,
  bulkDeleteUrl,
  mapper,
  initialPerPage = 10,
  extraParams,
}: UsePaginatedListOptions<T>) {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(initialPerPage)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<string | undefined>()
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const params: ListParams = { page, perPage, search, sortBy, sortOrder, dateFrom, dateTo, ...extraParams }

  const query = useQuery({
    queryKey: [queryKey, params],
    queryFn: async (): Promise<PaginatedResult<T>> => {
      const response = await apiClient.get<ApiResponse<ApiRecord[]>>(listUrl, {
        params: toListQueryParams(params),
      })
      return parsePaginatedResponse(response, mapper as (item: ApiRecord) => ApiRecord) as PaginatedResult<T>
    },
  })

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [queryKey] })
  }, [queryClient, queryKey])

  const deleteMutation = useMutation({
    mutationFn: async (deleteUrl: string) => {
      await apiClient.delete(deleteUrl)
    },
    onSuccess: invalidate,
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      if (!bulkDeleteUrl) return
      await apiClient.post(bulkDeleteUrl, { ids: ids.map(Number) })
    },
    onSuccess: () => {
      setSelectedIds([])
      invalidate()
    },
  })

  const handleSortChange = useCallback(
    (key: string) => {
      if (sortBy === key) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortBy(key)
        setSortOrder('asc')
      }
      setPage(1)
    },
    [sortBy],
  )

  return {
    items: query.data?.items ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    page,
    perPage,
    search,
    sortBy,
    sortOrder,
    dateFrom,
    dateTo,
    selectedIds,
    setPage,
    setPerPage,
    setSearch,
    setDateFrom,
    setDateTo,
    setSelectedIds,
    handleSortChange,
    deleteItem: deleteMutation.mutateAsync,
    bulkDelete: bulkDeleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending || bulkDeleteMutation.isPending,
    refetch: query.refetch,
  }
}

export function useResourceDetail<T>({
  queryKey,
  detailUrl,
  enabled,
  fromApi,
}: {
  queryKey: string
  detailUrl: string
  enabled: boolean
  fromApi: (item: ApiRecord) => T
}) {
  return useQuery({
    queryKey: [queryKey, detailUrl],
    enabled,
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ApiRecord>>(detailUrl)
      return fromApi(unwrapApiData(response))
    },
  })
}

export function useResourceMutation<TForm>({
  queryKey,
  createUrl,
  updateUrl,
  toApi,
  onSuccess,
}: {
  queryKey: string
  createUrl: string
  updateUrl?: string
  toApi: (data: TForm) => Record<string, unknown>
  onSuccess?: () => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: TForm }) => {
      const payload = toApi(data)
      if (id && updateUrl) {
        const response = await apiClient.put(updateUrl, payload)
        return response.data
      }
      const response = await apiClient.post(createUrl, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      onSuccess?.()
    },
  })
}
