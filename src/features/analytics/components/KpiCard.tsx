import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { KpiMetric } from '../types'

interface KpiCardProps {
  metric: KpiMetric
}

function formatValue(value: number, unit: KpiMetric['unit']): string {
  switch (unit) {
    case 'currency': return formatCurrency(value)
    case 'percent': return `${value.toFixed(1)}%`
    default: return formatNumber(value)
  }
}

export function KpiCard({ metric }: KpiCardProps) {
  const isUp = metric.trend === 'up'
  const isDown = metric.trend === 'down'

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {metric.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-2xl font-bold tracking-tight">
          {formatValue(metric.value, metric.unit)}
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          {isUp && <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />}
          {isDown && <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />}
          {!isUp && !isDown && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
          <span
            className={cn(
              'text-xs font-medium',
              isUp && 'text-green-600 dark:text-green-400',
              isDown && 'text-red-600 dark:text-red-400',
              !isUp && !isDown && 'text-muted-foreground',
            )}
          >
            {formatPercent(metric.changePercent)}
          </span>
          {metric.description && (
            <span className="text-[11px] text-muted-foreground">{metric.description}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
