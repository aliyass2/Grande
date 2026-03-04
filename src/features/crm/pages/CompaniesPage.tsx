import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/PageHeader'
import { DataTable } from '@/components/DataTable'
import { FilterBar } from '@/components/FilterBar'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { useCompanies } from '../hooks/useCrm'
import type { Company } from '../types'

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Media', 'Consulting', 'Real Estate']

const columns: ColumnDef<Company>[] = [
  {
    accessorKey: 'name',
    header: 'Company',
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-xs">{row.original.name}</p>
        <p className="text-[11px] text-muted-foreground">{row.original.city}, {row.original.country}</p>
      </div>
    ),
  },
  {
    accessorKey: 'industry',
    header: 'Industry',
    cell: ({ getValue }) => (
      <Badge variant="secondary" className="text-xs">{getValue<string>()}</Badge>
    ),
  },
  {
    accessorKey: 'size',
    header: 'Size',
    cell: ({ getValue }) => <span className="text-xs">{getValue<string>()} employees</span>,
  },
  {
    accessorKey: 'annualRevenue',
    header: 'Annual Revenue',
    cell: ({ getValue }) => (
      <span className="text-xs font-medium">{formatCurrency(getValue<number>())}</span>
    ),
  },
  {
    accessorKey: 'accountManager',
    header: 'Account Manager',
    cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'createdAt',
    header: 'Added',
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{formatDate(getValue<string>())}</span>
    ),
  },
]

export default function CompaniesPage() {
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('')

  const { data, isLoading, isError, refetch } = useCompanies({
    search: search || undefined,
    industry: industry || undefined,
  })

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Companies"
        description={`${data?.total ?? 0} companies`}
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search companies..."
        filters={
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder="All industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" " className="text-xs">All industries</SelectItem>
              {INDUSTRIES.map(i => (
                <SelectItem key={i} value={i} className="text-xs">{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="flex-1 overflow-auto">
        <DataTable data={data?.data ?? []} columns={columns} />
      </div>
    </div>
  )
}
