import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { unwrapApiData, type ApiRecord } from '@/api/utils'
import type { ApiResponse } from '@/types/api'

export async function uploadMediaFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await apiClient.post<ApiResponse<ApiRecord>>(endpoints.media.upload, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  const media = unwrapApiData(response)
  return String(media.url ?? '')
}
