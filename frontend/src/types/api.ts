export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface PaginationMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}

export interface ListParams {
  page?: number
  perPage?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  [key: string]: string | number | boolean | undefined
}

export interface UploadResponse {
  id: string
  url: string
  filename: string
  mimeType: string
  size: number
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
}
