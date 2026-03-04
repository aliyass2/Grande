import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, PlayCircle } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/PageHeader'
import { DataTable } from '@/components/DataTable'
import { FilterBar } from '@/components/FilterBar'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate, formatRelative } from '@/lib/formatters'
import { useReports } from '../hooks/useAnalytics'
import type { ReportDefinition } from '../types'
import { toast } from 'sonner'

const CATEGORY_LABELS: Record<string, string> = {
  finance: 'Finance',
  sales: 'Sales',
  operations: 'Operations',
  hr: 'HR',
  inventory: 'Inventory',
}

const columns: ColumnDef<ReportDefinition>[] = [
  {
    accessorKey: 'name',
    header: 'Report Name',
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-xs">{row.original.name}</p>
        <p className="text-[11px] text-muted-foreground truncate max-w-xs">{row.original.description}</p>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ getValue }) => (
      <Badge variant="secondary" className="text-xs capitalize">
        {CATEGORY_LABELS[getValue<string>()] ?? getValue<string>()}
      </Badge>
    ),
  },
  {
    accessorKey: 'rowCount',
    header: 'Rows',
    cell: ({ getValue }) => <span className="text-xs">{getValue<number>().toLocaleString()}</span>,
  },
  {
    accessorKey: 'lastRunAt',
    header: 'Last Run',
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{formatRelative(getValue<string>())}</span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{formatDate(getValue<string>())}</span>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => toast.success(`Running ${row.original.name}...`)}
        >
          <PlayCircle className="h-3.5 w-3.5 mr-1" />
          Run
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => toast.success('Export started (mock)')}
        >
          <Download className="h-3.5 w-3.5 mr-1" />
          CSV
        </Button>
      </div>
    ),
  },
]

export default function ReportsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const { data, isLoading, isError, refetch } = useReports({
    search: search || undefined,
    category: category || undefined,
  })

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Reports"
        description={`${data?.total ?? 0} reports available`}
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search reports..."
        filters={
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" " className="text-xs">All categories</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                <SelectItem key={v} value={v} className="text-xs">{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="flex-1 overflow-auto">
        <DataTable
          data={data?.data ?? []}
          columns={columns}
          onRowClick={(r) => navigate(`/reports/${r.id}`)}
        />
      </div>
    </div>
  )
}
