import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,   // data never goes stale — no background refetches
      gcTime: Infinity,      // cache is never garbage collected between navigations
      retry: false,          // don't retry; MSW errors are not transient
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
})
