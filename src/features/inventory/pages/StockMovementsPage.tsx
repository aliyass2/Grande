import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/PageHeader'
import { DataTable } from '@/components/DataTable'
import { FilterBar } from '@/components/FilterBar'
import { StatusBadge } from '@/components/StatusBadge'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDateTime } from '@/lib/formatters'
import { useStockMovements, useWarehouses } from '../hooks/useInventory'
import type { StockMovement } from '../types'

const columns: ColumnDef<StockMovement>[] = [
  {
    accessorKey: 'reference',
    header: 'Reference',
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ getValue }) => <StatusBadge status={getValue<string>()} />,
  },
  {
    accessorKey: 'itemSku',
    header: 'SKU',
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted-foreground">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'itemName',
    header: 'Item',
    cell: ({ getValue }) => <span className="text-xs">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'warehouseName',
    header: 'Warehouse',
    cell: ({ getValue }) => <span className="text-xs">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'quantity',
    header: 'Qty',
    cell: ({ row }) => {
      const t = row.original.type
      const q = row.original.quantity
      return (
        <span className={`text-xs font-semibold ${t === 'in' ? 'text-green-600' : t === 'out' ? 'text-red-600' : 'text-muted-foreground'}`}>
          {t === 'in' ? '+' : t === 'out' ? '-' : '±'}{q}
        </span>
      )
    },
  },
  {
    accessorKey: 'performedBy',
    header: 'By',
    cell: ({ getValue }) => <span className="text-xs">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'timestamp',
    header: 'Date/Time',
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{formatDateTime(getValue<string>())}</span>
    ),
  },
]

export default function StockMovementsPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [warehouseId, setWarehouseId] = useState('')

  const { data, isLoading, isError, refetch } = useStockMovements({
    search: search || undefined,
    type: type || undefined,
    warehouseId: warehouseId || undefined,
    pageSize: 200,
  })

  const { data: warehouses } = useWarehouses()

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Stock Movements"
        description={`${data?.total ?? 0} movement records`}
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search SKU, reference..."
        filters={
          <>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-8 w-32 text-xs">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" " className="text-xs">All types</SelectItem>
                <SelectItem value="in" className="text-xs">In</SelectItem>
                <SelectItem value="out" className="text-xs">Out</SelectItem>
                <SelectItem value="transfer" className="text-xs">Transfer</SelectItem>
                <SelectItem value="adjustment" className="text-xs">Adjustment</SelectItem>
              </SelectContent>
            </Select>
            <Select value={warehouseId} onValueChange={setWarehouseId}>
              <SelectTrigger className="h-8 w-44 text-xs">
                <SelectValue placeholder="All warehouses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" " className="text-xs">All warehouses</SelectItem>
                {warehouses?.map(w => (
                  <SelectItem key={w.id} value={w.id} className="text-xs">{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />

      <div className="flex-1 overflow-auto">
        <DataTable
          data={data?.data ?? []}
          columns={columns}
        />
      </div>
    </div>
  )
}
