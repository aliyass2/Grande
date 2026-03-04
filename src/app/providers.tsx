import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { queryClient } from '@/lib/queryClient'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider delayDuration={300}>
          {children}
          <Toaster position="bottom-right" richColors />
          <ReactQueryDevtools initialIsOpen={false} />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
