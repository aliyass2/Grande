import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { DataTable } from '@/components/DataTable'
import { FilterBar } from '@/components/FilterBar'
import { StatusBadge } from '@/components/StatusBadge'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { useExpenses, useUpdateExpense } from '../hooks/useFinance'
import type { Expense } from '../types'

const EXPENSE_CATEGORIES = [
  'Travel & Accommodation', 'Meals & Entertainment', 'Office Supplies',
  'Software Tools', 'Training & Education', 'Client Gifts', 'Subscriptions', 'Transport',
]

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations', 'HR', 'Legal']

export default function ExpensesPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [department, setDepartment] = useState('')
  const updateExpense = useUpdateExpense()

  const { data, isLoading, isError, refetch } = useExpenses({
    search: search || undefined,
    status: status || undefined,
    category: category || undefined,
    department: department || undefined,
  })

  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: 'reference',
      header: 'Reference',
      cell: ({ getValue }) => (
        <span className="font-mono text-xs font-medium">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'merchant',
      header: 'Merchant',
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
      accessorKey: 'department',
      header: 'Dept',
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue<string>()}</span>,
    },
    {
      accessorKey: 'submittedBy',
      header: 'Submitted By',
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue<string>()}</span>,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{formatDate(getValue<string>())}</span>,
    },
    {
      accessorKey: 'amount',
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
        const exp = row.original
        if (exp.status !== 'submitted') return null
        return (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-emerald-700 hover:text-emerald-700 hover:bg-emerald-50"
              onClick={e => {
                e.stopPropagation()
                updateExpense.mutate({ id: exp.id, data: { status: 'approved' } })
              }}
            >
              <ThumbsUp className="h-3.5 w-3.5 mr-1" />
              Approve
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-rose-600 hover:text-rose-600 hover:bg-rose-50"
              onClick={e => {
                e.stopPropagation()
                updateExpense.mutate({ id: exp.id, data: { status: 'rejected' } })
              }}
            >
              <ThumbsDown className="h-3.5 w-3.5 mr-1" />
              Reject
            </Button>
          </div>
        )
      },
    },
  ]

  const pendingCount = data?.data.filter(e => e.status === 'submitted').length ?? 0
  const pendingAmount = data?.data
    .filter(e => e.status === 'submitted')
    .reduce((s, e) => s + e.amount, 0) ?? 0
  const totalAmount = data?.data.reduce((s, e) => s + e.amount, 0) ?? 0

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Expenses"
        description={`${data?.total ?? 0} expense reports`}
      />

      {/* KPI strip */}
      <div className="flex gap-6 border-b px-6 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Pending Approval</p>
          <p className="text-sm font-semibold tabular-nums">
            {pendingCount} · {formatCurrency(pendingAmount)}
          </p>
        </div>
        <div className="w-px bg-border" />
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Total (Page)</p>
          <p className="text-sm font-semibold tabular-nums">{formatCurrency(totalAmount)}</p>
        </div>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search reference, merchant, employee..."
        filters={
          <>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" " className="text-xs">All statuses</SelectItem>
                <SelectItem value="draft"       className="text-xs">Draft</SelectItem>
                <SelectItem value="submitted"   className="text-xs">Submitted</SelectItem>
                <SelectItem value="approved"    className="text-xs">Approved</SelectItem>
                <SelectItem value="rejected"    className="text-xs">Rejected</SelectItem>
                <SelectItem value="reimbursed"  className="text-xs">Reimbursed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-8 w-44 text-xs">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" " className="text-xs">All categories</SelectItem>
                {EXPENSE_CATEGORIES.map(c => (
                  <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" " className="text-xs">All departments</SelectItem>
                {DEPARTMENTS.map(d => (
                  <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />

      <div className="flex-1 overflow-auto">
        <DataTable data={data?.data ?? []} columns={columns} selectable />
      </div>
    </div>
  )
}
