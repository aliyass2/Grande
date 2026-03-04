import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { UserCheck } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { DataTable } from '@/components/DataTable'
import { FilterBar } from '@/components/FilterBar'
import { StatusBadge } from '@/components/StatusBadge'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatRelative } from '@/lib/formatters'
import { useLeads, useUpdateLead } from '../hooks/useCrm'
import type { Lead } from '../types'

const SOURCE_LABELS: Record<string, string> = {
  website: 'Website',
  referral: 'Referral',
  linkedin: 'LinkedIn',
  email: 'Email',
  event: 'Event',
  cold_call: 'Cold Call',
}

export default function LeadsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const updateLead = useUpdateLead()

  const { data, isLoading, isError, refetch } = useLeads({
    search: search || undefined,
    status: status || undefined,
    source: source || undefined,
  })

  const columns: ColumnDef<Lead>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const l = row.original
        return (
          <div>
            <p className="font-medium text-xs">{l.firstName} {l.lastName}</p>
            <p className="text-[11px] text-muted-foreground">{l.email}</p>
          </div>
        )
      },
    },
    {
      accessorKey: 'company',
      header: 'Company',
      cell: ({ getValue }) => <span className="text-xs">{getValue<string>()}</span>,
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ getValue }) => (
        <Badge variant="outline" className="text-xs capitalize">
          {SOURCE_LABELS[getValue<string>()] ?? getValue<string>()}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => <StatusBadge status={getValue<string>()} />,
    },
    {
      accessorKey: 'assignedTo',
      header: 'Assigned To',
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue<string>()}</span>,
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
      cell: ({ row }) => {
        const lead = row.original
        if (lead.status === 'qualified') return null
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation()
              updateLead.mutate({ id: lead.id, data: { status: 'qualified' } })
            }}
          >
            <UserCheck className="h-3.5 w-3.5 mr-1" />
            Qualify
          </Button>
        )
      },
    },
  ]

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Leads"
        description={`${data?.total ?? 0} leads in the system`}
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search name, email, company..."
        filters={
          <>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 w-32 text-xs">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" " className="text-xs">All statuses</SelectItem>
                <SelectItem value="new" className="text-xs">New</SelectItem>
                <SelectItem value="contacted" className="text-xs">Contacted</SelectItem>
                <SelectItem value="qualified" className="text-xs">Qualified</SelectItem>
                <SelectItem value="disqualified" className="text-xs">Disqualified</SelectItem>
              </SelectContent>
            </Select>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="h-8 w-32 text-xs">
                <SelectValue placeholder="All sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" " className="text-xs">All sources</SelectItem>
                {Object.entries(SOURCE_LABELS).map(([v, l]) => (
                  <SelectItem key={v} value={v} className="text-xs">{l}</SelectItem>
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
