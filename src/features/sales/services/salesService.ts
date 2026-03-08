import { apiFetch, buildQS } from '@/services/http'
import type { PaginatedResponse, ListParams } from '@/types/common'
import type { Quote, SalesOrder, PricingRule } from '../types'

export const salesService = {
  listQuotes: (params?: ListParams) =>
    apiFetch<PaginatedResponse<Quote>>(`/api/sales/quotes${buildQS(params ?? {})}`),

  getQuote: (id: string) =>
    apiFetch<Quote>(`/api/sales/quotes/${id}`),

  updateQuote: (id: string, data: Partial<Quote>) =>
    apiFetch<Quote>(`/api/sales/quotes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  listOrders: (params?: ListParams) =>
    apiFetch<PaginatedResponse<SalesOrder>>(`/api/sales/orders${buildQS(params ?? {})}`),

  getOrder: (id: string) =>
    apiFetch<SalesOrder>(`/api/sales/orders/${id}`),

  updateOrder: (id: string, data: Partial<SalesOrder>) =>
    apiFetch<SalesOrder>(`/api/sales/orders/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  listPricingRules: (params?: ListParams) =>
    apiFetch<PaginatedResponse<PricingRule>>(`/api/sales/pricing-rules${buildQS(params ?? {})}`),

  updatePricingRule: (id: string, data: Partial<PricingRule>) =>
    apiFetch<PricingRule>(`/api/sales/pricing-rules/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
}
