import { useState, useMemo } from 'react'
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { formatCurrency, formatCompact, formatNumber, formatPercent } from '@/lib/formatters'
import { useDashboard } from '../hooks/useAnalytics'
import { KpiCard } from '../components/KpiCard'

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16']
const HEALTH_COLORS: Record<string, string> = {
  'In Stock': '#10b981',
  'Low Stock': '#f59e0b',
  'Out of Stock': '#ef4444',
  'On Order': '#3b82f6',
}

const PERIODS = [
  { label: '3M', value: 3 },
  { label: '6M', value: 6 },
  { label: '12M', value: 12 },
]

const REGIONS = ['All', 'North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East']

const tooltipStyle = {
  fontSize: 12,
  border: '1px solid hsl(240 5.9% 90%)',
  borderRadius: 6,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
}

export default function AnalyticsDashboardPage() {
  const { data, isLoading, isError, refetch, isFetching } = useDashboard()
  const [period, setPeriod] = useState(12)
  const [region, setRegion] = useState('All')

  const revenueTrend = useMemo(
    () => data?.revenueTrend.slice(-period) ?? [],
    [data, period]
  )
  const ordersTrend = useMemo(
    () => data?.ordersTrend.slice(-period) ?? [],
    [data, period]
  )
  const salesByRegion = useMemo(() => {
    if (!data) return []
    return region === 'All'
      ? data.salesByRegion
      : data.salesByRegion.filter((r) => r.region === region)
  }, [data, region])

  if (isLoading) return <LoadingSkeleton rows={8} />
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (!data) return null

  const totalPipeline = data.pipelineByStage.reduce((s, p) => s + p.value, 0)
  const totalInventory = data.inventoryHealth.reduce((s, p) => s + p.count, 0)

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Analytics Dashboard"
        description="Business performance overview"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
            Refresh
          </Button>
        }
      />

      {/* Sticky filter bar */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-3 px-6 py-2.5">
          <span className="text-xs font-medium text-muted-foreground">Period</span>
          <div className="flex items-center rounded-md border bg-muted/40 p-0.5 gap-0.5">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={cn(
                  'rounded px-3 py-1 text-xs font-medium transition-colors',
                  period === p.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-4" />

          <span className="text-xs font-medium text-muted-foreground">Region</span>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="h-7 w-[148px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto text-xs text-muted-foreground">
            Updated just now
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* KPI Grid - 8 KPIs */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {data.kpis.map((kpi) => (
            <KpiCard key={kpi.id} metric={kpi} />
          ))}
        </div>

        {/* Row 2: Revenue Area + Orders Line */}
        <div className="grid grid-cols-2 gap-5">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">Revenue Trend</CardTitle>
              <CardDescription className="text-xs">Monthly revenue — last {period} months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueTrend} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={formatCompact} width={42} />
                  <Tooltip
                    formatter={(v: number) => [formatCurrency(v), 'Revenue']}
                    contentStyle={tooltipStyle}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={CHART_COLORS[0]}
                    strokeWidth={2}
                    fill="url(#revGrad)"
                    dot={false}
                    activeDot={{ r: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">Orders Trend</CardTitle>
              <CardDescription className="text-xs">Total orders placed — last {period} months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={ordersTrend} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={formatCompact} width={42} />
                  <Tooltip
                    formatter={(v: number) => [formatNumber(v), 'Orders']}
                    contentStyle={tooltipStyle}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={CHART_COLORS[1]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Row 3: Revenue vs Target + Inventory Health */}
        <div className="grid grid-cols-3 gap-5">
          <Card className="col-span-2">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">Revenue vs Target</CardTitle>
              <CardDescription className="text-xs">Quarterly actual performance against set targets</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.revenueVsTarget} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={formatCompact} width={42} />
                  <Tooltip
                    formatter={(v: number, name: string) => [formatCurrency(v), name === 'actual' ? 'Actual' : 'Target']}
                    contentStyle={tooltipStyle}
                  />
                  <Legend
                    iconType="square"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11 }}
                    formatter={(v) => v === 'actual' ? 'Actual' : 'Target'}
                  />
                  <Bar dataKey="actual" fill={CHART_COLORS[0]} radius={[3, 3, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="target" fill={CHART_COLORS[2]} radius={[3, 3, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">Inventory Health</CardTitle>
              <CardDescription className="text-xs">{totalInventory} SKUs total</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={data.inventoryHealth}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={64}
                    paddingAngle={2}
                  >
                    {data.inventoryHealth.map((entry) => (
                      <Cell key={entry.status} fill={HEALTH_COLORS[entry.status] ?? CHART_COLORS[0]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number, name: string) => [v, name]}
                    contentStyle={tooltipStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1.5">
                {data.inventoryHealth.map((entry) => (
                  <div key={entry.status} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: HEALTH_COLORS[entry.status] }}
                      />
                      <span className="text-muted-foreground">{entry.status}</span>
                    </div>
                    <span className="font-medium tabular-nums">
                      {entry.count}
                      <span className="text-muted-foreground font-normal ml-1">
                        ({((entry.count / totalInventory) * 100).toFixed(0)}%)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 4: CRM Pipeline + Top Products */}
        <div className="grid grid-cols-2 gap-5">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">CRM Pipeline by Stage</CardTitle>
              <CardDescription className="text-xs">
                {formatCurrency(totalPipeline)} total pipeline value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={data.pipelineByStage}
                  layout="vertical"
                  margin={{ top: 0, right: 40, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                  <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={formatCompact} />
                  <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={80} />
                  <Tooltip
                    formatter={(v: number) => [formatCurrency(v), 'Pipeline Value']}
                    contentStyle={tooltipStyle}
                  />
                  <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={18}>
                    {data.pipelineByStage.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">Top Products by Revenue</CardTitle>
              <CardDescription className="text-xs">Current month performance</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left font-medium text-muted-foreground">Product</th>
                    <th className="pb-2 text-right font-medium text-muted-foreground">Revenue</th>
                    <th className="pb-2 text-right font-medium text-muted-foreground">Units</th>
                    <th className="pb-2 text-right font-medium text-muted-foreground">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topProducts.map((p, i) => (
                    <tr key={p.sku} className="border-b last:border-0">
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-semibold text-muted-foreground">
                            {i + 1}
                          </span>
                          <div>
                            <p className="font-medium text-foreground leading-tight truncate max-w-[160px]">{p.name}</p>
                            <p className="text-muted-foreground font-mono">{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 text-right tabular-nums font-medium">{formatCompact(p.revenue)}</td>
                      <td className="py-2.5 text-right tabular-nums text-muted-foreground">{formatNumber(p.units)}</td>
                      <td className="py-2.5 text-right">
                        <span className={cn(
                          'inline-flex items-center gap-0.5 font-medium',
                          p.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        )}>
                          {p.growth >= 0
                            ? <TrendingUp className="h-3 w-3" />
                            : <TrendingDown className="h-3 w-3" />
                          }
                          {Math.abs(p.growth).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Row 5: Sales by Region + Headcount Pie + Dept Budget */}
        <div className="grid grid-cols-3 gap-5">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">Sales by Region</CardTitle>
              <CardDescription className="text-xs">
                {region === 'All' ? 'All regions' : region}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={salesByRegion}
                  layout="vertical"
                  margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                  <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={formatCompact} />
                  <YAxis type="category" dataKey="region" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={70} />
                  <Tooltip
                    formatter={(v: number) => [formatCurrency(v), 'Revenue']}
                    contentStyle={tooltipStyle}
                  />
                  <Bar dataKey="revenue" fill={CHART_COLORS[0]} radius={[0, 3, 3, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">Headcount by Dept</CardTitle>
              <CardDescription className="text-xs">
                {data.departmentBreakdown.reduce((s, d) => s + d.headcount, 0)} total employees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data.departmentBreakdown}
                    dataKey="headcount"
                    nameKey="department"
                    cx="50%"
                    cy="50%"
                    outerRadius={72}
                    innerRadius={32}
                    paddingAngle={2}
                  >
                    {data.departmentBreakdown.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number, name: string) => [v, name]}
                    contentStyle={tooltipStyle}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={7}
                    wrapperStyle={{ fontSize: 10 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">Budget Allocation</CardTitle>
              <CardDescription className="text-xs">
                {formatCompact(data.departmentBreakdown.reduce((s, d) => s + d.budget, 0))} total budget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={data.departmentBreakdown}
                  margin={{ top: 5, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                  <XAxis dataKey="department" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={formatCompact} width={38} />
                  <Tooltip
                    formatter={(v: number) => [formatCurrency(v), 'Budget']}
                    contentStyle={tooltipStyle}
                  />
                  <Bar dataKey="budget" radius={[3, 3, 0, 0]} maxBarSize={28}>
                    {data.departmentBreakdown.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
