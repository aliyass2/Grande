import { http, HttpResponse, delay } from 'msw'
import {
  MOCK_JOURNAL_ENTRIES,
  MOCK_INVOICES,
  MOCK_BILLS,
  MOCK_EXPENSES,
  MOCK_LEDGER_ACCOUNTS,
  MOCK_PNL_ROWS,
  MOCK_BALANCE_SHEET,
} from '../data/finance'

const LAG = 300

function paginate<T>(items: T[], page = 1, pageSize = 50) {
  const start = (page - 1) * pageSize
  return { data: items.slice(start, start + pageSize), total: items.length, page, pageSize }
}

export const financeHandlers = [
  // Ledger accounts
  http.get('/api/finance/accounts', async () => {
    await delay(LAG)
    return HttpResponse.json(MOCK_LEDGER_ACCOUNTS)
  }),

  // Journal entries
  http.get('/api/finance/journal-entries', async ({ request }) => {
    await delay(LAG)
    const url = new URL(request.url)
    let items = [...MOCK_JOURNAL_ENTRIES]

    const search = url.searchParams.get('search')?.toLowerCase()
    const status = url.searchParams.get('status')

    if (search) items = items.filter(e =>
      e.reference.toLowerCase().includes(search) ||
      e.description.toLowerCase().includes(search) ||
      e.debitAccountName.toLowerCase().includes(search) ||
      e.creditAccountName.toLowerCase().includes(search)
    )
    if (status) items = items.filter(e => e.status === status)

    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 50)
    return HttpResponse.json(paginate(items, page, pageSize))
  }),

  // P&L summary
  http.get('/api/finance/pnl', async () => {
    await delay(LAG)
    return HttpResponse.json(MOCK_PNL_ROWS)
  }),

  // Balance sheet
  http.get('/api/finance/balance-sheet', async () => {
    await delay(LAG)
    return HttpResponse.json(MOCK_BALANCE_SHEET)
  }),

  // Invoices list
  http.get('/api/finance/invoices', async ({ request }) => {
    await delay(LAG)
    const url = new URL(request.url)
    let items = [...MOCK_INVOICES]

    const search = url.searchParams.get('search')?.toLowerCase()
    const status = url.searchParams.get('status')

    if (search) items = items.filter(i =>
      i.number.toLowerCase().includes(search) ||
      i.customerName.toLowerCase().includes(search)
    )
    if (status) items = items.filter(i => i.status === status)

    items.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())

    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 25)
    return HttpResponse.json(paginate(items, page, pageSize))
  }),

  // Invoice detail
  http.get('/api/finance/invoices/:id', async ({ params }) => {
    await delay(LAG)
    const inv = MOCK_INVOICES.find(i => i.id === params.id)
    if (!inv) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(inv)
  }),

  // Invoice patch
  http.patch('/api/finance/invoices/:id', async ({ params, request }) => {
    await delay(LAG)
    const index = MOCK_INVOICES.findIndex(i => i.id === params.id)
    if (index === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<typeof MOCK_INVOICES[0]>
    MOCK_INVOICES[index] = { ...MOCK_INVOICES[index], ...body }
    return HttpResponse.json(MOCK_INVOICES[index])
  }),

  // Bills list
  http.get('/api/finance/bills', async ({ request }) => {
    await delay(LAG)
    const url = new URL(request.url)
    let items = [...MOCK_BILLS]

    const search = url.searchParams.get('search')?.toLowerCase()
    const status = url.searchParams.get('status')
    const category = url.searchParams.get('category')

    if (search) items = items.filter(b =>
      b.number.toLowerCase().includes(search) ||
      b.vendorName.toLowerCase().includes(search)
    )
    if (status) items = items.filter(b => b.status === status)
    if (category) items = items.filter(b => b.category === category)

    items.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())

    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 25)
    return HttpResponse.json(paginate(items, page, pageSize))
  }),

  // Bill patch
  http.patch('/api/finance/bills/:id', async ({ params, request }) => {
    await delay(LAG)
    const index = MOCK_BILLS.findIndex(b => b.id === params.id)
    if (index === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<typeof MOCK_BILLS[0]>
    MOCK_BILLS[index] = { ...MOCK_BILLS[index], ...body }
    return HttpResponse.json(MOCK_BILLS[index])
  }),

  // Expenses list
  http.get('/api/finance/expenses', async ({ request }) => {
    await delay(LAG)
    const url = new URL(request.url)
    let items = [...MOCK_EXPENSES]

    const search = url.searchParams.get('search')?.toLowerCase()
    const status = url.searchParams.get('status')
    const category = url.searchParams.get('category')
    const department = url.searchParams.get('department')

    if (search) items = items.filter(e =>
      e.reference.toLowerCase().includes(search) ||
      e.merchant.toLowerCase().includes(search) ||
      e.submittedBy.toLowerCase().includes(search)
    )
    if (status) items = items.filter(e => e.status === status)
    if (category) items = items.filter(e => e.category === category)
    if (department) items = items.filter(e => e.department === department)

    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 25)
    return HttpResponse.json(paginate(items, page, pageSize))
  }),

  // Expense patch
  http.patch('/api/finance/expenses/:id', async ({ params, request }) => {
    await delay(LAG)
    const index = MOCK_EXPENSES.findIndex(e => e.id === params.id)
    if (index === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<typeof MOCK_EXPENSES[0]>
    MOCK_EXPENSES[index] = { ...MOCK_EXPENSES[index], ...body }
    return HttpResponse.json(MOCK_EXPENSES[index])
  }),
]
