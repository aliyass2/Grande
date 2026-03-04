import { apiFetch, buildQS } from '@/services/http'
import type { PaginatedResponse, ListParams } from '@/types/common'
import type { InventoryItem, Warehouse, StockMovement } from '../types'

export const inventoryService = {
  listItems: (params?: ListParams) =>
    apiFetch<PaginatedResponse<InventoryItem>>(`/api/inventory/items${buildQS(params ?? {})}`),

  getItem: (id: string) => apiFetch<InventoryItem>(`/api/inventory/items/${id}`),

  updateItem: (id: string, data: Partial<InventoryItem>) =>
    apiFetch<InventoryItem>(`/api/inventory/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  listWarehouses: () => apiFetch<Warehouse[]>('/api/inventory/warehouses'),
  getWarehouse: (id: string) => apiFetch<Warehouse>(`/api/inventory/warehouses/${id}`),

  listMovements: (params?: ListParams) =>
    apiFetch<PaginatedResponse<StockMovement>>(`/api/inventory/movements${buildQS(params ?? {})}`),
}
