export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiError {
  status: number
  message: string
  details?: Record<string, string[]>
}

export type SortOrder = 'asc' | 'desc'

export interface SortConfig {
  field: string
  order: SortOrder
}

export interface FilterConfig {
  [key: string]: string | string[] | undefined
}

export interface ListParams {
  page?: number
  pageSize?: number
  search?: string
  sort?: string
  order?: SortOrder
  [key: string]: unknown
}
