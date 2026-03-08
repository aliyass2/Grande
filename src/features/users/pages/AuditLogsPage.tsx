import { useState, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef } from 'ag-grid-community'
import { agTheme } from '@/lib/agGridTheme'
import { PageHeader } from '@/components/PageHeader'
import { FilterBar } from '@/components/FilterBar'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDateTime } from '@/lib/formatters'
import { useAuditLogs } from '../hooks/useUsers'
import type { AuditLog } from '../types'

const RESOURCES = ['user', 'role', 'inventory_item', 'lead', 'opportunity', 'report', 'settings']

export default function AuditLogsPage() {
  const [search, setSearch] = useState('')
  const [resource, setResource] = useState('')

  const { data, isLoading, isError, refetch } = useAuditLogs({
    search: search || undefined,
    resource: resource || undefined,
    pageSize: 250,
  })

  const colDefs = useMemo<ColDef<AuditLog>[]>(() => [
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      width: 170,
      valueFormatter: (p) => p.value ? formatDateTime(p.value) : '',
      sort: 'desc',
    },
    { field: 'userName', headerName: 'User', width: 160 },
    { field: 'action', headerName: 'Action', width: 200 },
    { field: 'resource', headerName: 'Resource', width: 140 },
    { field: 'resourceId', headerName: 'Resource ID', width: 140 },
    { field: 'ipAddress', headerName: 'IP Address', width: 130 },
  ], [])

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Audit Logs"
        description="Track all system actions and user activity."
      />
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search actions, users..."
        filters={
          <Select value={resource} onValueChange={setResource}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder="All resources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" " className="text-xs">All resources</SelectItem>
              {RESOURCES.map(r => (
                <SelectItem key={r} value={r} className="text-xs capitalize">{r.replace(/_/g, ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
      <div className="flex-1" style={{ minHeight: 400 }}>
        <AgGridReact
          theme={agTheme}
          rowData={data?.data ?? []}
          columnDefs={colDefs}
          defaultColDef={{ resizable: true, sortable: true, filter: true }}
          suppressCellFocus
          rowHeight={36}
          headerHeight={36}
          domLayout="autoHeight"
          pagination
          paginationPageSize={50}
        />
      </div>
    </div>
  )
}
