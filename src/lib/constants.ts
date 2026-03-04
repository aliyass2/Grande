export const APP_NAME = 'Grande ERP'
export const DEFAULT_PAGE_SIZE = 25
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export const DEPARTMENTS = [
  'Engineering',
  'Sales',
  'Marketing',
  'Finance',
  'Operations',
  'HR',
  'Legal',
] as const

export const USER_ROLES = ['admin', 'manager', 'analyst', 'viewer'] as const
export const USER_STATUSES = ['active', 'inactive', 'suspended'] as const
export const INVENTORY_STATUSES = ['active', 'low_stock', 'critical', 'discontinued'] as const
export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'disqualified'] as const
export const LEAD_SOURCES = ['website', 'referral', 'linkedin', 'email', 'event', 'cold_call'] as const
export const OPPORTUNITY_STAGES = ['prospect', 'proposal', 'negotiation', 'closed_won', 'closed_lost'] as const
export const MOVEMENT_TYPES = ['in', 'out', 'transfer', 'adjustment'] as const
