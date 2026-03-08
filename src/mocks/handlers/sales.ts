import { http, HttpResponse, delay } from 'msw'
import { MOCK_QUOTES, MOCK_SALES_ORDERS, MOCK_PRICING_RULES } from '../data/sales'

const LAG = 300

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = (page - 1) * pageSize
  return { data: items.slice(start, start + pageSize), total: items.length, page, pageSize }
}

export const salesHandlers = [
  // ── Quotes ──────────────────────────────────────────────────────────────────

  http.get('/api/sales/quotes', async ({ request }) => {
    await delay(LAG)
    const url = new URL(request.url)
    let items = [...MOCK_QUOTES]

    const search = url.searchParams.get('search')?.toLowerCase()
    const status = url.searchParams.get('status')

    if (search) items = items.filter(q =>
      q.number.toLowerCase().includes(search) ||
      q.customerName.toLowerCase().includes(search) ||
      q.assignedTo.toLowerCase().includes(search)
    )
    if (status) items = items.filter(q => q.status === status)

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 25)
    return HttpResponse.json(paginate(items, page, pageSize))
  }),

  http.get('/api/sales/quotes/:id', async ({ params }) => {
    await delay(LAG)
    const q = MOCK_QUOTES.find(q => q.id === params.id)
    if (!q) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(q)
  }),

  http.patch('/api/sales/quotes/:id', async ({ params, request }) => {
    await delay(LAG)
    const idx = MOCK_QUOTES.findIndex(q => q.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<typeof MOCK_QUOTES[0]>
    MOCK_QUOTES[idx] = { ...MOCK_QUOTES[idx], ...body }
    return HttpResponse.json(MOCK_QUOTES[idx])
  }),

  // ── Sales Orders ─────────────────────────────────────────────────────────────

  http.get('/api/sales/orders', async ({ request }) => {
    await delay(LAG)
    const url = new URL(request.url)
    let items = [...MOCK_SALES_ORDERS]

    const search = url.searchParams.get('search')?.toLowerCase()
    const status = url.searchParams.get('status')

    if (search) items = items.filter(o =>
      o.number.toLowerCase().includes(search) ||
      o.customerName.toLowerCase().includes(search) ||
      o.quoteNumber.toLowerCase().includes(search)
    )
    if (status) items = items.filter(o => o.status === status)

    items.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())

    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 25)
    return HttpResponse.json(paginate(items, page, pageSize))
  }),

  http.get('/api/sales/orders/:id', async ({ params }) => {
    await delay(LAG)
    const o = MOCK_SALES_ORDERS.find(o => o.id === params.id)
    if (!o) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(o)
  }),

  http.patch('/api/sales/orders/:id', async ({ params, request }) => {
    await delay(LAG)
    const idx = MOCK_SALES_ORDERS.findIndex(o => o.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<typeof MOCK_SALES_ORDERS[0]>
    MOCK_SALES_ORDERS[idx] = { ...MOCK_SALES_ORDERS[idx], ...body }
    return HttpResponse.json(MOCK_SALES_ORDERS[idx])
  }),

  // ── Pricing Rules ─────────────────────────────────────────────────────────────

  http.get('/api/sales/pricing-rules', async ({ request }) => {
    await delay(LAG)
    const url = new URL(request.url)
    let items = [...MOCK_PRICING_RULES]

    const search = url.searchParams.get('search')?.toLowerCase()
    const type = url.searchParams.get('type')
    const scope = url.searchParams.get('scope')

    if (search) items = items.filter(r =>
      r.name.toLowerCase().includes(search) ||
      r.scopeLabel.toLowerCase().includes(search)
    )
    if (type) items = items.filter(r => r.type === type)
    if (scope) items = items.filter(r => r.scope === scope)

    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 25)
    return HttpResponse.json(paginate(items, page, pageSize))
  }),

  http.patch('/api/sales/pricing-rules/:id', async ({ params, request }) => {
    await delay(LAG)
    const idx = MOCK_PRICING_RULES.findIndex(r => r.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<typeof MOCK_PRICING_RULES[0]>
    MOCK_PRICING_RULES[idx] = { ...MOCK_PRICING_RULES[idx], ...body }
    return HttpResponse.json(MOCK_PRICING_RULES[idx])
  }),
]
