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
import { useInvoices } from '../hooks/useFinance'
import type { Invoice } from '../types'

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'number',
    header: 'Invoice #',
    cell: ({ getValue }) => (
      <span className="font-mono text-xs font-medium">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'customerName',
    header: 'Customer',
    cell: ({ getValue }) => <span className="text-xs font-medium">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'issueDate',
    header: 'Issued',
    cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{formatDate(getValue<string>())}</span>,
  },
  {
    accessorKey: 'dueDate',
    header: 'Due',
    cell: ({ row }) => {
      const d = row.original
      const isOverdue = d.status === 'overdue'
      return (
        <span className={`text-xs ${isOverdue ? 'text-rose-600 font-medium' : 'text-muted-foreground'}`}>
          {formatDate(d.dueDate)}
        </span>
      )
    },
  },
  {
    accessorKey: 'subtotal',
    header: 'Subtotal',
    cell: ({ getValue }) => (
      <span className="text-xs tabular-nums text-muted-foreground">{formatCurrency(getValue<number>())}</span>
    ),
  },
  {
    accessorKey: 'tax',
    header: 'Tax',
    cell: ({ getValue }) => (
      <span className="text-xs tabular-nums text-muted-foreground">{formatCurrency(getValue<number>())}</span>
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

export default function InvoicesPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const navigate = useNavigate()

  const { data, isLoading, isError, refetch } = useInvoices({
    search: search || undefined,
    status: status || undefined,
  })

  const outstanding = data?.data
    .filter(i => i.status === 'sent' || i.status === 'overdue')
    .reduce((s, i) => s + i.total, 0) ?? 0
  const overdue = data?.data
    .filter(i => i.status === 'overdue')
    .reduce((s, i) => s + i.total, 0) ?? 0

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Invoices"
        description={`${data?.total ?? 0} invoices`}
      />

      {/* KPI strip */}
      <div className="flex gap-6 border-b px-6 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Outstanding</p>
          <p className="text-sm font-semibold tabular-nums">{formatCurrency(outstanding)}</p>
        </div>
        <div className="w-px bg-border" />
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Overdue</p>
          <p className="text-sm font-semibold tabular-nums text-rose-600">{formatCurrency(overdue)}</p>
        </div>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search invoice # or customer..."
        filters={
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" " className="text-xs">All statuses</SelectItem>
              <SelectItem value="draft"   className="text-xs">Draft</SelectItem>
              <SelectItem value="sent"    className="text-xs">Sent</SelectItem>
              <SelectItem value="paid"    className="text-xs">Paid</SelectItem>
              <SelectItem value="overdue" className="text-xs">Overdue</SelectItem>
              <SelectItem value="voided"  className="text-xs">Voided</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="flex-1 overflow-auto">
        <DataTable
          data={data?.data ?? []}
          columns={columns}
          onRowClick={row => navigate(`/finance/invoices/${row.id}`)}
        />
      </div>
    </div>
  )
}
