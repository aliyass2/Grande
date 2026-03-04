import { http, HttpResponse, delay } from 'msw'
import { MOCK_INVENTORY_ITEMS, MOCK_WAREHOUSES, MOCK_STOCK_MOVEMENTS } from '../data/inventory'

const LAG = 300

function paginate<T>(items: T[], page = 1, pageSize = 50) {
  const start = (page - 1) * pageSize
  return {
    data: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  }
}

export const inventoryHandlers = [
  http.get('/api/inventory/items', async ({ request }) => {
    await delay(LAG)
    const url = new URL(request.url)
    let items = [...MOCK_INVENTORY_ITEMS]
    const search = url.searchParams.get('search')?.toLowerCase()
    const category = url.searchParams.get('category')
    const status = url.searchParams.get('status')
    const warehouseId = url.searchParams.get('warehouseId')

    if (search) items = items.filter(i =>
      i.name.toLowerCase().includes(search) || i.sku.toLowerCase().includes(search)
    )
    if (category) items = items.filter(i => i.category === category)
    if (status) items = items.filter(i => i.status === status)
    if (warehouseId) items = items.filter(i => i.warehouseId === warehouseId)

    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 50)
    return HttpResponse.json(paginate(items, page, pageSize))
  }),

  http.get('/api/inventory/items/:id', async ({ params }) => {
    await delay(LAG)
    const item = MOCK_INVENTORY_ITEMS.find(i => i.id === params.id)
    if (!item) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(item)
  }),

  http.patch('/api/inventory/items/:id', async ({ params, request }) => {
    await delay(LAG)
    const index = MOCK_INVENTORY_ITEMS.findIndex(i => i.id === params.id)
    if (index === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<typeof MOCK_INVENTORY_ITEMS[0]>
    MOCK_INVENTORY_ITEMS[index] = { ...MOCK_INVENTORY_ITEMS[index], ...body }
    return HttpResponse.json(MOCK_INVENTORY_ITEMS[index])
  }),

  http.get('/api/inventory/warehouses', async () => {
    await delay(LAG)
    return HttpResponse.json(MOCK_WAREHOUSES)
  }),

  http.get('/api/inventory/warehouses/:id', async ({ params }) => {
    await delay(LAG)
    const wh = MOCK_WAREHOUSES.find(w => w.id === params.id)
    if (!wh) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(wh)
  }),

  http.get('/api/inventory/movements', async ({ request }) => {
    await delay(LAG)
    const url = new URL(request.url)
    let items = [...MOCK_STOCK_MOVEMENTS]
    const type = url.searchParams.get('type')
    const warehouseId = url.searchParams.get('warehouseId')
    const itemId = url.searchParams.get('itemId')
    const search = url.searchParams.get('search')?.toLowerCase()

    if (type) items = items.filter(m => m.type === type)
    if (warehouseId) items = items.filter(m => m.warehouseId === warehouseId)
    if (itemId) items = items.filter(m => m.itemId === itemId)
    if (search) items = items.filter(m =>
      m.itemName.toLowerCase().includes(search) ||
      m.itemSku.toLowerCase().includes(search) ||
      m.reference.toLowerCase().includes(search)
    )

    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 50)
    return HttpResponse.json(paginate(items, page, pageSize))
  }),
]
