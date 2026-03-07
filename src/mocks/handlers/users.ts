import { http, HttpResponse, delay } from 'msw'
import { MOCK_USERS, MOCK_ROLES, MOCK_PERMISSIONS, MOCK_AUDIT_LOGS } from '../data/users'

const LAG = 300

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = (page - 1) * pageSize
  return {
    data: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  }
}

function filterUsers(params: URLSearchParams) {
  let items = [...MOCK_USERS]
  const search = params.get('search')?.toLowerCase()
  const role = params.get('role')
  const status = params.get('status')
  const department = params.get('department')

  if (search) items = items.filter(u => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search))
  if (role) items = items.filter(u => u.role === role)
  if (status) items = items.filter(u => u.status === status)
  if (department) items = items.filter(u => u.department === department)
  return items
}

export const userHandlers = [
  http.get('/api/users', async ({ request }) => {
    await delay(LAG)
    const url = new URL(request.url)
    const filtered = filterUsers(url.searchParams)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 25)
    return HttpResponse.json(paginate(filtered, page, pageSize))
  }),

  http.get('/api/users/:id', async ({ params }) => {
    await delay(LAG)
    const user = MOCK_USERS.find(u => u.id === params.id)
    if (!user) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(user)
  }),

  http.post('/api/users', async ({ request }) => {
    await delay(LAG)
    const body = await request.json() as Partial<typeof MOCK_USERS[0]>
    const newUser = {
      ...body,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    }
    MOCK_USERS.push(newUser as typeof MOCK_USERS[0])
    return HttpResponse.json(newUser, { status: 201 })
  }),

  http.patch('/api/users/:id', async ({ params, request }) => {
    await delay(LAG)
    const index = MOCK_USERS.findIndex(u => u.id === params.id)
    if (index === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<typeof MOCK_USERS[0]>
    MOCK_USERS[index] = { ...MOCK_USERS[index], ...body }
    return HttpResponse.json(MOCK_USERS[index])
  }),

  http.delete('/api/users/:id', async ({ params }) => {
    await delay(LAG)
    const index = MOCK_USERS.findIndex(u => u.id === params.id)
    if (index === -1) return new HttpResponse(null, { status: 404 })
    MOCK_USERS.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/api/roles', async () => {
    await delay(LAG)
    return HttpResponse.json(MOCK_ROLES)
  }),

  http.get('/api/roles/:id', async ({ params }) => {
    await delay(LAG)
    const role = MOCK_ROLES.find(r => r.id === params.id)
    if (!role) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(role)
  }),

  http.post('/api/roles', async ({ request }) => {
    await delay(LAG)
    const body = await request.json() as Partial<typeof MOCK_ROLES[0]>
    const newRole = {
      ...body,
      id: `role_${Date.now()}`,
      userCount: 0,
      createdAt: new Date().toISOString(),
    }
    MOCK_ROLES.push(newRole as typeof MOCK_ROLES[0])
    return HttpResponse.json(newRole, { status: 201 })
  }),

  http.get('/api/permissions', async () => {
    await delay(LAG)
    return HttpResponse.json(MOCK_PERMISSIONS)
  }),

  http.post('/api/permissions', async ({ request }) => {
    await delay(LAG)
    const body = await request.json() as Partial<typeof MOCK_PERMISSIONS[0]>
    const newPerm = {
      ...body,
      id: `p_${Date.now()}`,
    }
    MOCK_PERMISSIONS.push(newPerm as typeof MOCK_PERMISSIONS[0])
    return HttpResponse.json(newPerm, { status: 201 })
  }),

  http.get('/api/audit-logs', async ({ request }) => {
    await delay(LAG)
    const url = new URL(request.url)
    let items = [...MOCK_AUDIT_LOGS]
    const search = url.searchParams.get('search')?.toLowerCase()
    const userId = url.searchParams.get('userId')
    const resource = url.searchParams.get('resource')

    if (search) items = items.filter(l => l.action.toLowerCase().includes(search) || l.userName.toLowerCase().includes(search))
    if (userId) items = items.filter(l => l.userId === userId)
    if (resource) items = items.filter(l => l.resource === resource)

    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 50)
    return HttpResponse.json(paginate(items, page, pageSize))
  }),
]
