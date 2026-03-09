import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { salesService } from '../services/salesService'
import type { ListParams } from '@/types/common'
import { toast } from 'sonner'

export function useQuotes(params?: ListParams) {
  return useQuery({
    queryKey: ['sales-quotes', params],
    queryFn: () => salesService.listQuotes(params),
  })
}

export function useQuote(id: string) {
  return useQuery({
    queryKey: ['sales-quotes', id],
    queryFn: () => salesService.getQuote(id),
    enabled: !!id,
  })
}

export function useUpdateQuote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof salesService.updateQuote>[1] }) =>
      salesService.updateQuote(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales-quotes'], refetchType: 'all' })
      toast.success('Quote updated')
    },
    onError: () => toast.error('Failed to update quote'),
  })
}

export function useSalesOrders(params?: ListParams) {
  return useQuery({
    queryKey: ['sales-orders', params],
    queryFn: () => salesService.listOrders(params),
  })
}

export function useSalesOrder(id: string) {
  return useQuery({
    queryKey: ['sales-orders', id],
    queryFn: () => salesService.getOrder(id),
    enabled: !!id,
  })
}

export function useUpdateSalesOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof salesService.updateOrder>[1] }) =>
      salesService.updateOrder(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales-orders'], refetchType: 'all' })
      toast.success('Order updated')
    },
    onError: () => toast.error('Failed to update order'),
  })
}

export function usePricingRules(params?: ListParams) {
  return useQuery({
    queryKey: ['sales-pricing-rules', params],
    queryFn: () => salesService.listPricingRules(params),
  })
}

export function useUpdatePricingRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof salesService.updatePricingRule>[1] }) =>
      salesService.updatePricingRule(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales-pricing-rules'], refetchType: 'all' })
      toast.success('Pricing rule updated')
    },
    onError: () => toast.error('Failed to update pricing rule'),
  })
}
