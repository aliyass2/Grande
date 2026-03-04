export type UserRole = 'admin' | 'manager' | 'analyst' | 'viewer'

export interface MockUser {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  avatar?: string
  permissions: string[]
}

export const MOCK_USER: MockUser = {
  id: 'usr_admin_001',
  name: 'Alexandra Chen',
  email: 'a.chen@grande-corp.com',
  role: 'admin',
  department: 'Engineering',
  permissions: [
    'users:read', 'users:write', 'users:delete',
    'roles:read', 'roles:write',
    'audit:read',
    'inventory:read', 'inventory:write', 'inventory:delete',
    'analytics:read',
    'reports:read', 'reports:export',
    'crm:read', 'crm:write', 'crm:delete',
  ],
}
