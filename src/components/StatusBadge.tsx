import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type StatusVariant = 'success' | 'warning' | 'destructive' | 'info' | 'secondary' | 'outline'

const STATUS_MAP: Record<string, StatusVariant> = {
  // User statuses
  active: 'success',
  inactive: 'secondary',
  suspended: 'destructive',
  // Inventory statuses
  low_stock: 'warning',
  critical: 'destructive',
  discontinued: 'secondary',
  // Lead statuses
  new: 'info',
  contacted: 'secondary',
  qualified: 'success',
  disqualified: 'destructive',
  // Opportunity stages
  prospect: 'info',
  proposal: 'secondary',
  negotiation: 'warning',
  closed_won: 'success',
  closed_lost: 'destructive',
  // Movement types
  in: 'success',
  out: 'warning',
  transfer: 'info',
  adjustment: 'secondary',
  // Finance statuses
  draft: 'secondary',
  sent: 'info',
  paid: 'success',
  overdue: 'destructive',
  voided: 'secondary',
  posted: 'success',
  received: 'info',
  approved: 'success',
  submitted: 'warning',
  rejected: 'destructive',
  reimbursed: 'success',
  // Sales Quote statuses
  accepted: 'success',
  expired: 'secondary',
  converted: 'info',
  // Sales Order statuses
  pending: 'secondary',
  confirmed: 'info',
  processing: 'warning',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'destructive',
}

const STATUS_LABELS: Record<string, string> = {
  low_stock: 'Low Stock',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
  cold_call: 'Cold Call',
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = STATUS_MAP[status] ?? 'outline'
  const label = STATUS_LABELS[status] ?? status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <Badge variant={variant} className={cn('capitalize', className)}>
      {label}
    </Badge>
  )
}
