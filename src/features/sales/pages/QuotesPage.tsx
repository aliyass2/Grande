import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { FileText } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { DataTable } from '@/components/DataTable'
import { FilterBar } from '@/components/FilterBar'
import { StatusBadge } from '@/components/StatusBadge'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { useQuotes } from '../hooks/useSales'
import type { Quote } from '../types'
import { toast } from 'sonner'

const columns: ColumnDef<Quote>[] = [
  {
    accessorKey: 'number',
    header: 'Quote #',
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
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'issueDate',
    header: 'Issued',
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{formatDate(getValue<string>())}</span>
    ),
  },
  {
    accessorKey: 'expiryDate',
    header: 'Expires',
    cell: ({ row }) => {
      const d = row.original
      return (
        <span className={`text-xs ${d.status === 'expired' ? 'text-rose-600 font-medium' : 'text-muted-foreground'}`}>
          {formatDate(d.expiryDate)}
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
    accessorKey: 'discountAmount',
    header: 'Discount',
    cell: ({ getValue }) => {
      const v = getValue<number>()
      return v > 0
        ? <span className="text-xs tabular-nums text-amber-600 font-medium">-{formatCurrency(v)}</span>
        : <span className="text-xs text-muted-foreground">—</span>
    },
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

export default function QuotesPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const navigate = useNavigate()

  const { data, isLoading, isError, refetch } = useQuotes({
    search: search || undefined,
    status: status || undefined,
  })

  const sentValue = data?.data.filter(q => q.status === 'sent').reduce((s, q) => s + q.total, 0) ?? 0
  const draftCount = data?.data.filter(q => q.status === 'draft').length ?? 0
  const wonValue = data?.data
    .filter(q => q.status === 'accepted' || q.status === 'converted')
    .reduce((s, q) => s + q.total, 0) ?? 0

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Quotes"
        description={`${data?.total ?? 0} quotes`}
        actions={
          <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => toast.info('Quote builder — coming soon')}>
            <FileText className="h-3.5 w-3.5" />
            New Quote
          </Button>
        }
      />

      {/* KPI strip */}
      <div className="flex gap-6 border-b px-6 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Open (Sent)</p>
          <p className="text-sm font-semibold tabular-nums">{formatCurrency(sentValue)}</p>
        </div>
        <div className="w-px bg-border" />
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Drafts</p>
          <p className="text-sm font-semibold tabular-nums">{draftCount}</p>
        </div>
        <div className="w-px bg-border" />
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Won Value</p>
          <p className="text-sm font-semibold tabular-nums text-emerald-600">{formatCurrency(wonValue)}</p>
        </div>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search quote # or customer..."
        filters={
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" "          className="text-xs">All statuses</SelectItem>
              <SelectItem value="draft"      className="text-xs">Draft</SelectItem>
              <SelectItem value="sent"       className="text-xs">Sent</SelectItem>
              <SelectItem value="accepted"   className="text-xs">Accepted</SelectItem>
              <SelectItem value="rejected"   className="text-xs">Rejected</SelectItem>
              <SelectItem value="expired"    className="text-xs">Expired</SelectItem>
              <SelectItem value="converted"  className="text-xs">Converted</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="flex-1 overflow-auto">
        <DataTable
          data={data?.data ?? []}
          columns={columns}
          onRowClick={row => navigate(`/sales/quotes/${row.id}`)}
        />
      </div>
    </div>
  )
}
