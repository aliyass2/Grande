export interface KpiMetric {
  id: string
  label: string
  value: number
  previousValue: number
  unit: 'currency' | 'number' | 'percent'
  trend: 'up' | 'down' | 'neutral'
  changePercent: number
  description?: string
}

export interface TimeSeriesPoint {
  date: string
  value: number
  label?: string
}

export interface RegionDataPoint {
  region: string
  revenue: number
  orders: number
}

export interface DepartmentDataPoint {
  department: string
  headcount: number
  budget: number
}

export interface ReportDefinition {
  id: string
  name: string
  category: 'finance' | 'sales' | 'operations' | 'hr' | 'inventory'
  description: string
  columns: ReportColumn[]
  rowCount: number
  lastRunAt: string
  createdAt: string
}

export interface ReportColumn {
  key: string
  label: string
  type: 'string' | 'number' | 'currency' | 'date' | 'status'
}

export type ReportRow = Record<string, unknown>

export interface AnalyticsDashboardData {
  kpis: KpiMetric[]
  revenueTrend: TimeSeriesPoint[]
  salesByRegion: RegionDataPoint[]
  departmentBreakdown: DepartmentDataPoint[]
}
