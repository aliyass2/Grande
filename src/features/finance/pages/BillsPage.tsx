import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { DataTable } from '@/components/DataTable'
import { FilterBar } from '@/components/FilterBar'
import { StatusBadge } from '@/components/StatusBadge'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { useBills, useUpdateBill } from '../hooks/useFinance'
import type { Bill } from '../types'

const BILL_CATEGORIES = [
  'Software & SaaS', 'Cloud Infrastructure', 'Professional Services',
  'Office & Facilities', 'Marketing', 'Hardware', 'Utilities', 'Insurance',
]

export default function BillsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const updateBill = useUpdateBill()

  const { data, isLoading, isError, refetch } = useBills({
    search: search || undefined,
    status: status || undefined,
    category: category || undefined,
  })

  const columns: ColumnDef<Bill>[] = [
    {
      accessorKey: 'number',
      header: 'Bill #',
      cell: ({ getValue }) => (
        <span className="font-mono text-xs font-medium">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'vendorName',
      header: 'Vendor',
      cell: ({ getValue }) => <span className="text-xs font-medium">{getValue<string>()}</span>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ getValue }) => (
        <Badge variant="secondary" className="text-[11px] font-normal">{getValue<string>()}</Badge>
      ),
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
        const isOverdue = row.original.status === 'overdue'
        return (
          <span className={`text-xs ${isOverdue ? 'text-rose-600 font-medium' : 'text-muted-foreground'}`}>
            {formatDate(row.original.dueDate)}
          </span>
        )
      },
    },
    {
      accessorKey: 'total',
      header: 'Amount',
      cell: ({ getValue }) => (
        <span className="text-xs tabular-nums font-semibold">{formatCurrency(getValue<number>())}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => <StatusBadge status={getValue<string>()} />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const bill = row.original
        if (bill.status === 'paid' || bill.status === 'draft') return null
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={e => {
              e.stopPropagation()
              updateBill.mutate({ id: bill.id, data: { status: 'paid' } })
            }}
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Pay
          </Button>
        )
      },
    },
  ]

  const payable = data?.data
    .filter(b => b.status === 'approved' || b.status === 'received' || b.status === 'overdue')
    .reduce((s, b) => s + b.total, 0) ?? 0
  const overdue = data?.data
    .filter(b => b.status === 'overdue')
    .reduce((s, b) => s + b.total, 0) ?? 0

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Bills"
        description={`${data?.total ?? 0} vendor bills`}
      />

      {/* KPI strip */}
      <div className="flex gap-6 border-b px-6 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Payable</p>
          <p className="text-sm font-semibold tabular-nums">{formatCurrency(payable)}</p>
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
        searchPlaceholder="Search bill # or vendor..."
        filters={
          <>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" " className="text-xs">All statuses</SelectItem>
                <SelectItem value="draft"    className="text-xs">Draft</SelectItem>
                <SelectItem value="received" className="text-xs">Received</SelectItem>
                <SelectItem value="approved" className="text-xs">Approved</SelectItem>
                <SelectItem value="paid"     className="text-xs">Paid</SelectItem>
                <SelectItem value="overdue"  className="text-xs">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-8 w-44 text-xs">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" " className="text-xs">All categories</SelectItem>
                {BILL_CATEGORIES.map(c => (
                  <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />

      <div className="flex-1 overflow-auto">
        <DataTable data={data?.data ?? []} columns={columns} />
      </div>
    </div>
  )
}
