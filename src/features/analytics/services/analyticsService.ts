import { apiFetch, buildQS } from '@/services/http'
import type { PaginatedResponse, ListParams } from '@/types/common'
import type { AnalyticsDashboardData, ReportDefinition } from '../types'

export const analyticsService = {
  getDashboard: () => apiFetch<AnalyticsDashboardData>('/api/analytics/dashboard'),

  listReports: (params?: ListParams) =>
    apiFetch<PaginatedResponse<ReportDefinition>>(`/api/reports${buildQS(params ?? {})}`),

  getReport: (id: string) => apiFetch<ReportDefinition>(`/api/reports/${id}`),
}
