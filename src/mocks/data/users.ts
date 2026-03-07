import { pick, weightedPick, randomInt, fullName, email, generateId } from '../helpers/faker'
import { daysAgo, hoursAgo, minutesAgo } from '../helpers/dates'
import type { User, Role, AuditLog } from '@/features/users/types'

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations', 'HR', 'Legal']
const ROLES: User['role'][] = ['admin', 'manager', 'analyst', 'viewer']
const AUDIT_ACTIONS = [
  'user.login', 'user.logout', 'user.created', 'user.updated', 'user.deleted',
  'role.assigned', 'inventory.item_updated', 'inventory.stock_adjusted',
  'crm.lead_converted', 'crm.opportunity_stage_changed',
  'report.exported', 'settings.changed',
]
const RESOURCES = ['user', 'role', 'inventory_item', 'lead', 'opportunity', 'report', 'settings']
const IPS = ['192.168.1.', '10.0.0.', '172.16.0.']

export const MOCK_USERS: User[] = Array.from({ length: 50 }, (_, i) => {
  const name = fullName()
  return {
    id: generateId('usr', i + 1),
    name,
    email: email(name),
    role: weightedPick([
      { value: 'admin' as const, weight: 5 },
      { value: 'manager' as const, weight: 15 },
      { value: 'analyst' as const, weight: 20 },
      { value: 'viewer' as const, weight: 60 },
    ]),
    status: weightedPick([
      { value: 'active' as const, weight: 75 },
      { value: 'inactive' as const, weight: 15 },
      { value: 'suspended' as const, weight: 10 },
    ]),
    department: pick(DEPARTMENTS),
    lastLoginAt: i % 5 === 0 ? daysAgo(randomInt(10, 30)) : (i % 3 === 0 ? daysAgo(randomInt(1, 9)) : hoursAgo(randomInt(1, 72))),
    createdAt: daysAgo(randomInt(30, 730)),
  }
})

// Ensure admin user is first with consistent ID
MOCK_USERS[0] = {
  id: 'usr_admin_001',
  name: 'Alexandra Chen',
  email: 'a.chen@grande-corp.com',
  role: 'admin',
  status: 'active',
  department: 'Engineering',
  lastLoginAt: minutesAgo(15),
  createdAt: daysAgo(720),
}


export const MOCK_PERMISSIONS: Permission[] = [
  { id: 'p001', resource: 'users',     action: 'create', label: 'Create Users' },
  { id: 'p002', resource: 'users',     action: 'read',   label: 'View Users' },
  { id: 'p003', resource: 'users',     action: 'update', label: 'Edit Users' },
  { id: 'p004', resource: 'users',     action: 'delete', label: 'Delete Users' },
  { id: 'p005', resource: 'roles',     action: 'create', label: 'Create Roles' },
  { id: 'p006', resource: 'roles',     action: 'read',   label: 'View Roles' },
  { id: 'p007', resource: 'roles',     action: 'update', label: 'Edit Roles' },
  { id: 'p008', resource: 'roles',     action: 'delete', label: 'Delete Roles' },
  { id: 'p009', resource: 'inventory', action: 'create', label: 'Create Items' },
  { id: 'p010', resource: 'inventory', action: 'read',   label: 'View Inventory' },
  { id: 'p011', resource: 'inventory', action: 'update', label: 'Edit Items' },
  { id: 'p012', resource: 'inventory', action: 'delete', label: 'Delete Items' },
  { id: 'p013', resource: 'crm',       action: 'create', label: 'Create CRM Records' },
  { id: 'p014', resource: 'crm',       action: 'read',   label: 'View CRM' },
  { id: 'p015', resource: 'crm',       action: 'update', label: 'Edit CRM Records' },
  { id: 'p016', resource: 'crm',       action: 'delete', label: 'Delete CRM Records' },
  { id: 'p017', resource: 'reports',   action: 'create', label: 'Create Reports' },
  { id: 'p018', resource: 'reports',   action: 'read',   label: 'View Reports' },
  { id: 'p019', resource: 'reports',   action: 'update', label: 'Edit Reports' },
  { id: 'p020', resource: 'reports',   action: 'delete', label: 'Delete Reports' },
]
export const MOCK_ROLES: Role[] = [
  {
    id: 'role_001',
    name: 'Administrator',
    description: 'Full system access including user management, settings, and all modules.',
    userCount: MOCK_USERS.filter(u => u.role === 'admin').length,
    permissions: [
      { id: 'p001', resource: 'users', action: 'create', label: 'Create Users' },
      { id: 'p002', resource: 'users', action: 'read', label: 'View Users' },
      { id: 'p003', resource: 'users', action: 'update', label: 'Edit Users' },
      { id: 'p004', resource: 'users', action: 'delete', label: 'Delete Users' },
      { id: 'p005', resource: 'roles', action: 'create', label: 'Create Roles' },
      { id: 'p006', resource: 'roles', action: 'read', label: 'View Roles' },
      { id: 'p007', resource: 'roles', action: 'update', label: 'Edit Roles' },
      { id: 'p008', resource: 'inventory', action: 'create', label: 'Create Items' },
      { id: 'p009', resource: 'inventory', action: 'read', label: 'View Inventory' },
      { id: 'p010', resource: 'inventory', action: 'update', label: 'Edit Items' },
      { id: 'p011', resource: 'inventory', action: 'delete', label: 'Delete Items' },
      { id: 'p012', resource: 'crm', action: 'create', label: 'Create CRM Records' },
      { id: 'p013', resource: 'crm', action: 'read', label: 'View CRM' },
      { id: 'p014', resource: 'crm', action: 'update', label: 'Edit CRM Records' },
      { id: 'p015', resource: 'crm', action: 'delete', label: 'Delete CRM Records' },
    ],
    createdAt: daysAgo(730),
  },
  {
    id: 'role_002',
    name: 'Manager',
    description: 'Can manage team members, view all reports, and perform operational tasks.',
    userCount: MOCK_USERS.filter(u => u.role === 'manager').length,
    permissions: [
      { id: 'p002', resource: 'users', action: 'read', label: 'View Users' },
      { id: 'p003', resource: 'users', action: 'update', label: 'Edit Users' },
      { id: 'p006', resource: 'roles', action: 'read', label: 'View Roles' },
      { id: 'p009', resource: 'inventory', action: 'read', label: 'View Inventory' },
      { id: 'p010', resource: 'inventory', action: 'update', label: 'Edit Items' },
      { id: 'p012', resource: 'crm', action: 'create', label: 'Create CRM Records' },
      { id: 'p013', resource: 'crm', action: 'read', label: 'View CRM' },
      { id: 'p014', resource: 'crm', action: 'update', label: 'Edit CRM Records' },
    ],
    createdAt: daysAgo(700),
  },
  {
    id: 'role_003',
    name: 'Analyst',
    description: 'Read access to all data modules with export capabilities.',
    userCount: MOCK_USERS.filter(u => u.role === 'analyst').length,
    permissions: [
      { id: 'p002', resource: 'users', action: 'read', label: 'View Users' },
      { id: 'p009', resource: 'inventory', action: 'read', label: 'View Inventory' },
      { id: 'p013', resource: 'crm', action: 'read', label: 'View CRM' },
    ],
    createdAt: daysAgo(600),
  },
  {
    id: 'role_004',
    name: 'Viewer',
    description: 'Read-only access to assigned modules.',
    userCount: MOCK_USERS.filter(u => u.role === 'viewer').length,
    permissions: [
      { id: 'p009', resource: 'inventory', action: 'read', label: 'View Inventory' },
      { id: 'p013', resource: 'crm', action: 'read', label: 'View CRM' },
    ],
    createdAt: daysAgo(500),
  },
]

export const MOCK_AUDIT_LOGS: AuditLog[] = Array.from({ length: 250 }, (_, i) => {
  const user = pick(MOCK_USERS.slice(0, 20))
  const action = pick(AUDIT_ACTIONS)
  const resource = pick(RESOURCES)
  const ipBase = pick(IPS)
  return {
    id: generateId('log', i + 1),
    userId: user.id,
    userName: user.name,
    action,
    resource,
    resourceId: generateId(resource, randomInt(1, 50)),
    meta: { module: resource, details: `${action} on ${resource}` },
    ipAddress: `${ipBase}${randomInt(1, 254)}`,
    timestamp: i < 5 ? minutesAgo(randomInt(1, 60)) : (i < 30 ? hoursAgo(randomInt(1, 48)) : daysAgo(randomInt(1, 60))),
  }
})
