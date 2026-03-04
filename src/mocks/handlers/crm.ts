import { http, HttpResponse, delay } from 'msw'
import { MOCK_LEADS, MOCK_CONTACTS, MOCK_COMPANIES, MOCK_OPPORTUNITIES, MOCK_ACTIVITIES } from '../data/crm'

const LAG = 300

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = (page - 1) * pageSize
  return { data: items.slice(start, start + pageSize), total: items.length, page, pageSize }
}

export const crmHandlers = [
  // Leads
  http.get('/api/crm/leads', async ({ request }) => {
    await delay(LAG)
    const url = new URL(request.url)
    let items = [...MOCK_LEADS]
    const search = url.searchParams.get('search')?.toLowerCase()
    const status = url.searchParams.get('status')
    const source = url.searchParams.get('source')

    if (search) items = items.filter(l =>
      l.firstName.toLowerCase().includes(search) ||
      l.lastName.toLowerCase().includes(search) ||
      l.email.toLowerCase().includes(search) ||
      l.company.toLowerCase().includes(search)
    )
    if (status) items = items.filter(l => l.status === status)
    if (source) items = items.filter(l => l.source === source)

    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 25)
    return HttpResponse.json(paginate(items, page, pageSize))
  }),

  http.patch('/api/crm/leads/:id', async ({ params, request }) => {
    await delay(LAG)
    const index = MOCK_LEADS.findIndex(l => l.id === params.id)
    if (index === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<typeof MOCK_LEADS[0]>
    MOCK_LEADS[index] = { ...MOCK_LEADS[index], ...body }
    return HttpResponse.json(MOCK_LEADS[index])
  }),

  // Contacts
  http.get('/api/crm/contacts', async ({ request }) => {
    await delay(LAG)
    const url = new URL(request.url)
    let items = [...MOCK_CONTACTS]
    const search = url.searchParams.get('search')?.toLowerCase()
    const companyId = url.searchParams.get('companyId')

    if (search) items = items.filter(c =>
      c.firstName.toLowerCase().includes(search) ||
      c.lastName.toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search) ||
      c.companyName.toLowerCase().includes(search)
    )
    if (companyId) items = items.filter(c => c.companyId === companyId)

    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 25)
    return HttpResponse.json(paginate(items, page, pageSize))
  }),

  http.get('/api/crm/contacts/:id', async ({ params }) => {
    await delay(LAG)
    const contact = MOCK_CONTACTS.find(c => c.id === params.id)
    if (!contact) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(contact)
  }),

  // Companies
  http.get('/api/crm/companies', async ({ request }) => {
    await delay(LAG)
    const url = new URL(request.url)
    let items = [...MOCK_COMPANIES]
    const search = url.searchParams.get('search')?.toLowerCase()
    const industry = url.searchParams.get('industry')

    if (search) items = items.filter(c => c.name.toLowerCase().includes(search))
    if (industry) items = items.filter(c => c.industry === industry)

    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 25)
    return HttpResponse.json(paginate(items, page, pageSize))
  }),

  http.get('/api/crm/companies/:id', async ({ params }) => {
    await delay(LAG)
    const company = MOCK_COMPANIES.find(c => c.id === params.id)
    if (!company) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(company)
  }),

  // Opportunities
  http.get('/api/crm/opportunities', async ({ request }) => {
    await delay(LAG)
    const url = new URL(request.url)
    let items = [...MOCK_OPPORTUNITIES]
    const stage = url.searchParams.get('stage')
    const companyId = url.searchParams.get('companyId')
    const contactId = url.searchParams.get('contactId')

    if (stage) items = items.filter(o => o.stage === stage)
    if (companyId) items = items.filter(o => o.companyId === companyId)
    if (contactId) items = items.filter(o => o.contactId === contactId)

    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 50)
    return HttpResponse.json(paginate(items, page, pageSize))
  }),

  http.get('/api/crm/opportunities/:id', async ({ params }) => {
    await delay(LAG)
    const opp = MOCK_OPPORTUNITIES.find(o => o.id === params.id)
    if (!opp) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(opp)
  }),

  http.patch('/api/crm/opportunities/:id', async ({ params, request }) => {
    await delay(LAG)
    const index = MOCK_OPPORTUNITIES.findIndex(o => o.id === params.id)
    if (index === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<typeof MOCK_OPPORTUNITIES[0]>
    MOCK_OPPORTUNITIES[index] = { ...MOCK_OPPORTUNITIES[index], ...body }
    return HttpResponse.json(MOCK_OPPORTUNITIES[index])
  }),

  // Activities
  http.get('/api/crm/activities', async ({ request }) => {
    await delay(LAG)
    const url = new URL(request.url)
    let items = [...MOCK_ACTIVITIES]
    const relatedToId = url.searchParams.get('relatedToId')
    const type = url.searchParams.get('type')

    if (relatedToId) items = items.filter(a => a.relatedTo.id === relatedToId)
    if (type) items = items.filter(a => a.type === type)

    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 25)
    return HttpResponse.json(paginate(items, page, pageSize))
  }),
]
