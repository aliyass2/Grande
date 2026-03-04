export class ApiError extends Error {
  constructor(
    public status: number,
    public data: unknown,
  ) {
    super(`API error ${status}`)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const base = import.meta.env.VITE_MOCKAPI_URL ?? ''
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new ApiError(res.status, data)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export function buildQS(params: Record<string, unknown>): string {
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      qs.set(k, String(v))
    }
  }
  return qs.toString() ? `?${qs.toString()}` : ''
}
