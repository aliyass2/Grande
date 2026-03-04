export interface InventoryItem {
  id: string
  sku: string
  name: string
  category: string
  description: string
  unit: string
  unitCost: number
  currentStock: number
  minStock: number
  reorderPoint: number
  warehouseId: string
  warehouseName: string
  status: 'active' | 'low_stock' | 'critical' | 'discontinued'
  lastUpdated: string
}

export interface Warehouse {
  id: string
  name: string
  location: string
  city: string
  country: string
  capacity: number
  currentUtilization: number
  manager: string
  createdAt: string
}

export interface StockMovement {
  id: string
  itemId: string
  itemName: string
  itemSku: string
  warehouseId: string
  warehouseName: string
  type: 'in' | 'out' | 'transfer' | 'adjustment'
  quantity: number
  reference: string
  notes: string
  performedBy: string
  timestamp: string
}
