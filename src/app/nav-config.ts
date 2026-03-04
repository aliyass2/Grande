import {
  BarChart3,
  FileText,
  Users,
  ShieldCheck,
  ClipboardList,
  Package,
  Warehouse,
  ArrowLeftRight,
  UserPlus,
  Building2,
  Kanban,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Analytics',
    items: [
      { label: 'Dashboard', href: '/analytics', icon: BarChart3 },
      { label: 'Reports', href: '/reports', icon: FileText },
    ],
  },
  {
    label: 'People',
    items: [
      { label: 'Users', href: '/users', icon: Users },
      { label: 'Roles', href: '/roles', icon: ShieldCheck },
      { label: 'Audit Logs', href: '/audit-logs', icon: ClipboardList },
    ],
  },
  {
    label: 'Inventory',
    items: [
      { label: 'Items', href: '/inventory/items', icon: Package },
      { label: 'Warehouses', href: '/inventory/warehouses', icon: Warehouse },
      { label: 'Movements', href: '/inventory/movements', icon: ArrowLeftRight },
    ],
  },
  {
    label: 'CRM',
    items: [
      { label: 'Leads', href: '/crm/leads', icon: UserPlus },
      { label: 'Contacts', href: '/crm/contacts', icon: Users },
      { label: 'Companies', href: '/crm/companies', icon: Building2 },
      { label: 'Pipeline', href: '/crm/pipeline', icon: Kanban },
    ],
  },
]
