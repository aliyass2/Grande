export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'analyst' | 'viewer'
  status: 'active' | 'inactive' | 'suspended'
  department: string
  lastLoginAt: string
  createdAt: string
}

export interface Permission {
  id: string
  resource: string
  action: 'create' | 'read' | 'update' | 'delete'
  label: string
}

export interface Role {
  id: string
  name: string
  description: string
  userCount: number
  permissions: Permission[]
  createdAt: string
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId: string
  meta: Record<string, unknown>
  ipAddress: string
  timestamp: string
}
