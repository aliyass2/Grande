import { useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { MOCK_NOTIFICATIONS } from '@/mocks/data/notifications'
import type { AppNotification } from './types'

// Simulate a mutable in-memory store so mark-read actions persist within the session
let store: AppNotification[] = structuredClone(MOCK_NOTIFICATIONS)

async function fetchNotifications(): Promise<AppNotification[]> {
  await new Promise((r) => setTimeout(r, 200))
  return [...store]
}

export function useNotifications() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })

  const unreadCount = (query.data ?? []).filter((n) => !n.read).length

  const markRead = useCallback(
    (id: string) => {
      store = store.map((n) => (n.id === id ? { ...n, read: true } : n))
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    [queryClient],
  )

  const markAllRead = useCallback(() => {
    store = store.map((n) => ({ ...n, read: true }))
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }, [queryClient])

  return { ...query, unreadCount, markRead, markAllRead }
}
