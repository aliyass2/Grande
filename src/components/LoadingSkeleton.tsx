import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  rows?: number
  className?: string
}

export function LoadingSkeleton({ rows = 5, className }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-2 p-6', className)}>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-9 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  )
}

export function TableLoadingSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-1 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </div>
  )
}
