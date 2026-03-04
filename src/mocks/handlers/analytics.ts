import { http, HttpResponse, delay } from 'msw'
import { DASHBOARD_DATA, MOCK_REPORTS } from '../data/analytics'

const LAG = 300

export const analyticsHandlers = [
  http.get('/api/analytics/dashboard', async () => {
    await delay(LAG)
    return HttpResponse.json(DASHBOARD_DATA)
  }),

  http.get('/api/reports', async ({ request }) => {
    await delay(LAG)
    const url = new URL(request.url)
    let items = [...MOCK_REPORTS]
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')?.toLowerCase()
    if (category) items = items.filter(r => r.category === category)
    if (search) items = items.filter(r => r.name.toLowerCase().includes(search) || r.description.toLowerCase().includes(search))
    return HttpResponse.json({ data: items, total: items.length, page: 1, pageSize: items.length })
  }),

  http.get('/api/reports/:id', async ({ params }) => {
    await delay(LAG)
    const report = MOCK_REPORTS.find(r => r.id === params.id)
    if (!report) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(report)
  }),
]
