import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, Warehouse, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/StatusBadge'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/formatters'
import { useInventoryItem, useStockMovements } from '../hooks/useInventory'

export default function InventoryItemDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: item, isLoading, isError } = useInventoryItem(id!)
  const { data: movements } = useStockMovements({ itemId: id, pageSize: 20 })

  if (isLoading) return <LoadingSkeleton />
  if (isError || !item) return <ErrorState onRetry={() => navigate('/inventory/items')} />

  const stockPct = Math.min(100, (item.currentStock / (item.reorderPoint * 2)) * 100)
  const isLow = item.currentStock <= item.reorderPoint
  const isCritical = item.currentStock <= item.minStock

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/inventory/items')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold">{item.name}</h1>
              <Badge variant="outline" className="font-mono text-xs">{item.sku}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{item.category}</p>
          </div>
        </div>
        <StatusBadge status={item.status} />
        <Button size="sm" className="h-8 text-xs">Reorder</Button>
      </div>

      <div className="grid grid-cols-3 gap-4 p-6">
        <div className="col-span-2 space-y-4">
          {/* Stock Gauge */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                Current Stock Level
                {isCritical && (
                  <span className="flex items-center gap-1 text-xs text-red-600">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Critical
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold">{item.currentStock.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">{item.unit}s on hand</span>
              </div>
              <Progress
                value={stockPct}
                className={isCritical ? '[&>div]:bg-red-500' : isLow ? '[&>div]:bg-yellow-500' : ''}
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Min: {item.minStock}</span>
                <span>Reorder at: {item.reorderPoint}</span>
                <span>Safe level: {item.reorderPoint * 2}</span>
              </div>
            </CardContent>
          </Card>

          {/* Movement History */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Movement History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {movements?.data.length ? (
                  movements.data.map((m) => (
                    <div key={m.id} className="flex items-center gap-3 px-4 py-2.5">
                      <StatusBadge status={m.type} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium font-mono">{m.reference}</p>
                        <p className="text-[11px] text-muted-foreground">{m.performedBy}</p>
                      </div>
                      <span className={`text-xs font-semibold ${m.type === 'in' ? 'text-green-600' : m.type === 'out' ? 'text-red-600' : 'text-muted-foreground'}`}>
                        {m.type === 'in' ? '+' : m.type === 'out' ? '-' : '±'}{m.quantity}
                      </span>
                      <span className="text-[11px] text-muted-foreground w-28 text-right">
                        {formatDateTime(m.timestamp)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="px-4 py-6 text-center text-xs text-muted-foreground">No movements found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Item Details</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit Cost</span>
                <span className="font-semibold">{formatCurrency(item.unitCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Value</span>
                <span className="font-semibold">{formatCurrency(item.unitCost * item.currentStock)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit</span>
                <span className="font-medium capitalize">{item.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">{formatDate(item.lastUpdated)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <Warehouse className="h-3.5 w-3.5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1.5">
              <p className="font-medium">{item.warehouseName}</p>
              <p className="text-muted-foreground text-[11px]">Warehouse ID: {item.warehouseId}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
