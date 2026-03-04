import { pick, weightedPick, randomInt, randomFloat, fullName, generateId } from '../helpers/faker'
import { daysAgo, hoursAgo } from '../helpers/dates'
import type { InventoryItem, Warehouse, StockMovement } from '@/features/inventory/types'

export const MOCK_WAREHOUSES: Warehouse[] = [
  {
    id: 'wh_001',
    name: 'Northgate Facility',
    location: '4821 Industrial Pkwy',
    city: 'Chicago',
    country: 'US',
    capacity: 50000,
    currentUtilization: 38420,
    manager: 'Marcus Rodriguez',
    createdAt: daysAgo(1200),
  },
  {
    id: 'wh_002',
    name: 'Westside Distribution Center',
    location: '1201 Commerce Blvd',
    city: 'Los Angeles',
    country: 'US',
    capacity: 75000,
    currentUtilization: 61500,
    manager: 'Priya Patel',
    createdAt: daysAgo(900),
  },
  {
    id: 'wh_003',
    name: 'Atlantic Hub',
    location: '88 Harbor Lane',
    city: 'New York',
    country: 'US',
    capacity: 35000,
    currentUtilization: 29800,
    manager: 'James Wilson',
    createdAt: daysAgo(600),
  },
]

const CATEGORIES = ['Electronics', 'Hardware', 'Software', 'Accessories', 'Office Supplies', 'Safety Equipment']
const UNITS = ['unit', 'box', 'kg', 'liter', 'pack', 'roll']

const PRODUCT_NAMES: Record<string, string[]> = {
  Electronics: [
    'Wireless Keyboard Pro', 'USB-C Hub 7-Port', 'Monitor Arm Dual', '4K Webcam HD',
    'Noise-Canceling Headset', 'Portable SSD 1TB', 'Smart Power Strip', 'LED Desk Lamp',
    'Graphics Tablet M', 'Network Switch 24P',
  ],
  Hardware: [
    'M5 Hex Bolt Set', 'Stainless Steel Nut Pack', 'Industrial Cable Tie', 'Aluminum Rail 2m',
    'Heavy Duty Hook Set', 'Steel Washer Kit', 'Rubber Seal Pack', 'Mounting Bracket Kit',
  ],
  Software: [
    'License Pack x10', 'Security Suite Annual', 'Backup Software Pro', 'Analytics Platform',
    'Design Suite License', 'Project Mgmt License',
  ],
  Accessories: [
    'Cable Organizer Kit', 'Screen Cleaning Set', 'Laptop Stand Foldable', 'Phone Mount Pro',
    'Bluetooth Adapter', 'Memory Card 256GB', 'HDMI Cable 2m', 'Ethernet Cable Cat6',
  ],
  'Office Supplies': [
    'A4 Copy Paper Ream', 'Ballpoint Pen Box', 'Sticky Note Set', 'File Folder Set',
    'Binder A4 Pack', 'Whiteboard Marker Set', 'Correction Tape Pack', 'Paper Clip Box',
  ],
  'Safety Equipment': [
    'Hard Hat Class E', 'Safety Vest Hi-Vis', 'Nitrile Glove Pack', 'Eye Protection Set',
    'Ear Protection Set', 'First Aid Kit Std', 'Fire Extinguisher 2kg',
  ],
}

function generateSku(category: string, index: number): string {
  const prefix = category.substring(0, 3).toUpperCase().replace(' ', '')
  return `${prefix}-${String(index + 1000).padStart(5, '0')}`
}

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = Array.from({ length: 200 }, (_, i) => {
  const category = pick(CATEGORIES)
  const warehouse = pick(MOCK_WAREHOUSES)
  const names = PRODUCT_NAMES[category] ?? PRODUCT_NAMES.Electronics
  const currentStock = randomInt(0, 500)
  const minStock = randomInt(10, 50)
  const reorderPoint = minStock + randomInt(10, 30)

  let status: InventoryItem['status']
  if (currentStock === 0) status = 'critical'
  else if (currentStock <= minStock) status = 'low_stock'
  else if (i % 20 === 0) status = 'discontinued'
  else status = 'active'

  return {
    id: generateId('item', i + 1),
    sku: generateSku(category, i),
    name: pick(names),
    category,
    description: `${category} product — ${pick(names)}`,
    unit: pick(UNITS),
    unitCost: randomFloat(5, 2500, 2),
    currentStock,
    minStock,
    reorderPoint,
    warehouseId: warehouse.id,
    warehouseName: warehouse.name,
    status,
    lastUpdated: i < 20 ? hoursAgo(randomInt(1, 48)) : daysAgo(randomInt(1, 30)),
  }
})

const MOVEMENT_TYPES: StockMovement['type'][] = ['in', 'out', 'transfer', 'adjustment']
const REF_PREFIXES = ['PO-', 'SO-', 'TRF-', 'ADJ-']

export const MOCK_STOCK_MOVEMENTS: StockMovement[] = Array.from({ length: 500 }, (_, i) => {
  const item = pick(MOCK_INVENTORY_ITEMS)
  const warehouse = MOCK_WAREHOUSES.find(w => w.id === item.warehouseId) ?? MOCK_WAREHOUSES[0]
  const type = weightedPick([
    { value: 'in' as const, weight: 30 },
    { value: 'out' as const, weight: 40 },
    { value: 'transfer' as const, weight: 15 },
    { value: 'adjustment' as const, weight: 15 },
  ])
  const refIndex = ['in', 'out', 'transfer', 'adjustment'].indexOf(type)

  return {
    id: generateId('mvt', i + 1),
    itemId: item.id,
    itemName: item.name,
    itemSku: item.sku,
    warehouseId: warehouse.id,
    warehouseName: warehouse.name,
    type,
    quantity: randomInt(1, 200),
    reference: `${REF_PREFIXES[refIndex]}${String(10000 + i).padStart(5, '0')}`,
    notes: type === 'adjustment' ? 'Cycle count correction' : '',
    performedBy: fullName(),
    timestamp: i < 20 ? hoursAgo(randomInt(1, 24)) : daysAgo(randomInt(1, 90)),
  }
})
