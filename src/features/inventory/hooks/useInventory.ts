import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryService } from '../services/inventoryService'
import type { ListParams } from '@/types/common'
import { toast } from 'sonner'

export function useInventoryItems(params?: ListParams) {
  return useQuery({
    queryKey: ['inventory-items', params],
    queryFn: () => inventoryService.listItems(params),
  })
}

export function useInventoryItem(id: string) {
  return useQuery({
    queryKey: ['inventory-items', id],
    queryFn: () => inventoryService.getItem(id),
    enabled: !!id,
  })
}

export function useWarehouses() {
  return useQuery({
    queryKey: ['warehouses'],
    queryFn: inventoryService.listWarehouses,
  })
}

export function useStockMovements(params?: ListParams) {
  return useQuery({
    queryKey: ['stock-movements', params],
    queryFn: () => inventoryService.listMovements(params),
  })
}

export function useUpdateInventoryItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof inventoryService.updateItem>[1] }) =>
      inventoryService.updateItem(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory-items'] })
      toast.success('Item updated')
    },
    onError: () => toast.error('Failed to update item'),
  })
}
