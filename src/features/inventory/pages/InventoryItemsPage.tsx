import { useState, useMemo } from 'react'
import { useIsDark } from '@/lib/useTheme'
import { useNavigate } from 'react-router-dom'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef, ICellRendererParams, CellStyle } from 'ag-grid-community'
import { themeAlpine, colorSchemeDark } from 'ag-grid-community'
import { Package, Download } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { FilterBar } from '@/components/FilterBar'
import { StatusBadge } from '@/components/StatusBadge'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { useInventoryItems, useWarehouses } from '../hooks/useInventory'
import type { InventoryItem } from '../types'
import { toast } from 'sonner'

const CATEGORIES = ['Electronics', 'Hardware', 'Software', 'Accessories', 'Office Supplies', 'Safety Equipment']

export default function InventoryItemsPage() {
  const isDark = useIsDark()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [warehouseId, setWarehouseId] = useState('')

  const { data, isLoading, isError, refetch } = useInventoryItems({
    search: search || undefined,
    category: category || undefined,
    status: status || undefined,
    warehouseId: warehouseId || undefined,
    pageSize: 500,
  })

  const { data: warehouses } = useWarehouses()

  const colDefs = useMemo<ColDef<InventoryItem>[]>(() => [
    { field: 'sku', headerName: 'SKU', width: 130, pinned: 'left' },
    {
      field: 'name',
      headerName: 'Item Name',
      width: 220,
      cellRenderer: (p: ICellRendererParams<InventoryItem>) => (
        <span
          className="font-medium text-xs cursor-pointer hover:underline text-blue-600 dark:text-blue-400"
          onClick={() => navigate(`/inventory/items/${p.data?.id}`)}
        >
          {p.value}
        </span>
      ),
    },
    { field: 'category', headerName: 'Category', width: 140 },
    { field: 'warehouseName', headerName: 'Warehouse', width: 160 },
    {
      field: 'currentStock',
      headerName: 'Stock',
      width: 100,
      type: 'numericColumn',
      cellStyle: (p): CellStyle => {
        if (p.value === 0) return { color: '#ef4444', fontWeight: 'bold' }
        if (p.value <= ((p.data as InventoryItem)?.minStock ?? 0)) return { color: '#f59e0b' }
        return {}
      },
    },
    { field: 'minStock', headerName: 'Min Stock', width: 100, type: 'numericColumn' },
    { field: 'reorderPoint', headerName: 'Reorder At', width: 110, type: 'numericColumn' },
    {
      field: 'unitCost',
      headerName: 'Unit Cost',
      width: 110,
      valueFormatter: (p) => p.value ? formatCurrency(p.value) : '',
    },
    { field: 'unit', headerName: 'Unit', width: 80 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      cellRenderer: (p: ICellRendererParams<InventoryItem>) => (
        <StatusBadge status={p.value} />
      ),
    },
    {
      field: 'lastUpdated',
      headerName: 'Updated',
      width: 130,
      valueFormatter: (p) => p.value ? formatDate(p.value) : '',
    },
  ], [navigate])

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Inventory Items"
        description={`${data?.total ?? 0} items across all warehouses`}
        actions={
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Download className="h-3.5 w-3.5 mr-1" />
            Export
          </Button>
        }
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search SKU or name..."
        filters={
          <>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" " className="text-xs">All categories</SelectItem>
                {CATEGORIES.map(c => (
                  <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 w-32 text-xs">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" " className="text-xs">All statuses</SelectItem>
                <SelectItem value="active" className="text-xs">Active</SelectItem>
                <SelectItem value="low_stock" className="text-xs">Low Stock</SelectItem>
                <SelectItem value="critical" className="text-xs">Critical</SelectItem>
                <SelectItem value="discontinued" className="text-xs">Discontinued</SelectItem>
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
        actions={
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => toast.info('Bulk reorder queued (mock)')}>
            <Package className="h-3.5 w-3.5 mr-1" />
            Bulk Reorder
          </Button>
        }
      />

      <div className="flex-1" style={{ minHeight: 400 }}>
        <AgGridReact
          theme={isDark ? themeAlpine.withPart(colorSchemeDark) : themeAlpine}
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
