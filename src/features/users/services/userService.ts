import { apiFetch, buildQS } from '@/services/http'
import type { PaginatedResponse, ListParams } from '@/types/common'
import type { User, Role, Permission, AuditLog } from '../types'

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
  create: (data: Omit<Role, 'id' | 'userCount' | 'createdAt'>) =>
    apiFetch<Role>('/api/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

export const permissionService = {
  list: () => apiFetch<Permission[]>('/api/permissions'),
  create: (data: Omit<Permission, 'id'>) =>
    apiFetch<Permission>('/api/permissions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

export const auditService = {
  list: (params?: ListParams) =>
    apiFetch<PaginatedResponse<AuditLog>>(`/api/audit-logs${buildQS(params ?? {})}`),
}
