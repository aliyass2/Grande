import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../services/analyticsService'
import type { ListParams } from '@/types/common'

export function useDashboard() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: analyticsService.getDashboard,
  })
}

export function useReports(params?: ListParams) {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => analyticsService.listReports(params),
  })
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: () => analyticsService.getReport(id),
    enabled: !!id,
  })
}
