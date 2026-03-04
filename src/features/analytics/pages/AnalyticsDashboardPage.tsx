import {
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
import { PageHeader } from '@/components/PageHeader'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatCompact } from '@/lib/formatters'
import { useDashboard } from '../hooks/useAnalytics'
import { KpiCard } from '../components/KpiCard'

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4']

export default function AnalyticsDashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboard()

  if (isLoading) return <LoadingSkeleton rows={6} />
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (!data) return null

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Analytics Dashboard"
        description="Business performance overview"
      />

      <div className="p-6 space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {data.kpis.map((kpi) => (
            <KpiCard key={kpi.id} metric={kpi} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Revenue Trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Revenue Trend (12 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.revenueTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => formatCompact(v)}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={CHART_COLORS[0]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sales by Region */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Sales by Region</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={data.salesByRegion}
                  layout="vertical"
                  margin={{ top: 5, right: 10, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => formatCompact(v)}
                  />
                  <YAxis
                    type="category"
                    dataKey="region"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={58}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="revenue" fill={CHART_COLORS[0]} radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Department Breakdown Pie */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Headcount by Department</CardTitle>
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
                    outerRadius={75}
                    label={({ department, percent }) =>
                      `${department.split(' ')[0]} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {data.departmentBreakdown.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [value, name]}
                    contentStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Department Budget Bar */}
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Department Budget Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={data.departmentBreakdown}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                  <XAxis
                    dataKey="department"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => formatCompact(v)}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Budget']}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="budget" radius={[3, 3, 0, 0]}>
                    {data.departmentBreakdown.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
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
