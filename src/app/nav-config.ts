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
  BookOpen,
  Receipt,
  FileInput,
  Wallet,
  FileCheck2,
  ShoppingCart,
  Tag,
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
    label: 'Finance',
    items: [
      { label: 'Ledger',   href: '/finance/ledger',   icon: BookOpen },
      { label: 'Invoices', href: '/finance/invoices',  icon: Receipt  },
      { label: 'Bills',    href: '/finance/bills',     icon: FileInput },
      { label: 'Expenses', href: '/finance/expenses',  icon: Wallet   },
    ],
  },
  {
    label: 'Sales',
    items: [
      { label: 'Quotes',  href: '/sales/quotes',  icon: FileCheck2    },
      { label: 'Orders',  href: '/sales/orders',  icon: ShoppingCart  },
      { label: 'Pricing', href: '/sales/pricing', icon: Tag           },
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
