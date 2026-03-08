import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/PageHeader'
import { DataTable } from '@/components/DataTable'
import { FilterBar } from '@/components/FilterBar'
import { StatusBadge } from '@/components/StatusBadge'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { useSalesOrders } from '../hooks/useSales'
import type { SalesOrder } from '../types'

const columns: ColumnDef<SalesOrder>[] = [
  {
    accessorKey: 'number',
    header: 'Order #',
    cell: ({ getValue }) => (
      <span className="font-mono text-xs font-medium">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'quoteNumber',
    header: 'Quote',
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted-foreground">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'customerName',
    header: 'Customer',
    cell: ({ getValue }) => <span className="text-xs font-medium">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'orderDate',
    header: 'Order Date',
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{formatDate(getValue<string>())}</span>
    ),
  },
  {
    accessorKey: 'expectedDelivery',
    header: 'Exp. Delivery',
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{formatDate(getValue<string>())}</span>
    ),
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ getValue }) => (
      <span className="text-xs tabular-nums font-semibold">{formatCurrency(getValue<number>())}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge status={getValue<string>()} />,
  },
]

export default function SalesOrdersPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const navigate = useNavigate()

  const { data, isLoading, isError, refetch } = useSalesOrders({
    search: search || undefined,
    status: status || undefined,
  })

  const pendingCount = data?.data.filter(o => o.status === 'pending').length ?? 0
  const inProgressCount = data?.data.filter(o =>
    ['confirmed', 'processing', 'shipped'].includes(o.status)
  ).length ?? 0
  const deliveredValue = data?.data
    .filter(o => o.status === 'delivered')
    .reduce((s, o) => s + o.total, 0) ?? 0

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Sales Orders"
        description={`${data?.total ?? 0} orders`}
      />

      {/* KPI strip */}
      <div className="flex gap-6 border-b px-6 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Pending</p>
          <p className="text-sm font-semibold tabular-nums">{pendingCount}</p>
        </div>
        <div className="w-px bg-border" />
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">In Progress</p>
          <p className="text-sm font-semibold tabular-nums">{inProgressCount}</p>
        </div>
        <div className="w-px bg-border" />
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Delivered Value</p>
          <p className="text-sm font-semibold tabular-nums text-emerald-600">{formatCurrency(deliveredValue)}</p>
        </div>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search order #, quote # or customer..."
        filters={
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" "           className="text-xs">All statuses</SelectItem>
              <SelectItem value="pending"     className="text-xs">Pending</SelectItem>
              <SelectItem value="confirmed"   className="text-xs">Confirmed</SelectItem>
              <SelectItem value="processing"  className="text-xs">Processing</SelectItem>
              <SelectItem value="shipped"     className="text-xs">Shipped</SelectItem>
              <SelectItem value="delivered"   className="text-xs">Delivered</SelectItem>
              <SelectItem value="cancelled"   className="text-xs">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="flex-1 overflow-auto">
        <DataTable
          data={data?.data ?? []}
          columns={columns}
          onRowClick={row => navigate(`/sales/orders/${row.id}`)}
        />
      </div>
    </div>
  )
}
