import { MapPin, Package } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatNumber } from '@/lib/formatters'
import { useWarehouses } from '../hooks/useInventory'

export default function WarehousesPage() {
  const { data: warehouses, isLoading, isError, refetch } = useWarehouses()

  if (isLoading) return <LoadingSkeleton rows={3} />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Warehouses"
        description={`${warehouses?.length ?? 0} warehouse facilities`}
      />

      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3">
        {warehouses?.map((wh) => {
          const utilizationPct = Math.round((wh.currentUtilization / wh.capacity) * 100)
          const isHigh = utilizationPct >= 85
          const isMedium = utilizationPct >= 65

          return (
            <Card key={wh.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm">{wh.name}</CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {wh.city}, {wh.country}
                    </CardDescription>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Utilization</span>
                    <span className={`font-semibold ${isHigh ? 'text-red-600' : isMedium ? 'text-yellow-600' : 'text-green-600'}`}>
                      {utilizationPct}%
                    </span>
                  </div>
                  <Progress
                    value={utilizationPct}
                    className={isHigh ? '[&>div]:bg-red-500' : isMedium ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}
                  />
                  <div className="flex justify-between mt-1 text-[11px] text-muted-foreground">
                    <span>{formatNumber(wh.currentUtilization)} units</span>
                    <span>Capacity: {formatNumber(wh.capacity)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Manager</p>
                    <p className="font-medium">{wh.manager}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium truncate" title={wh.location}>{wh.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
