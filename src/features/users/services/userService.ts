import { apiFetch, buildQS } from '@/services/http'
import type { PaginatedResponse, ListParams } from '@/types/common'
import type { User, Role, AuditLog } from '../types'

export const userService = {
  list: (params?: ListParams) =>
    apiFetch<PaginatedResponse<User>>(`/api/users${buildQS(params ?? {})}`),

  getById: (id: string) =>
    apiFetch<User>(`/api/users/${id}`),

  create: (data: Partial<User>) =>
    apiFetch<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<User>) =>
    apiFetch<User>(`/api/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    apiFetch<void>(`/api/users/${id}`, { method: 'DELETE' }),
}

export const roleService = {
  list: () => apiFetch<Role[]>('/api/roles'),
  getById: (id: string) => apiFetch<Role>(`/api/roles/${id}`),
}

export const auditService = {
  list: (params?: ListParams) =>
    apiFetch<PaginatedResponse<AuditLog>>(`/api/audit-logs${buildQS(params ?? {})}`),
}
