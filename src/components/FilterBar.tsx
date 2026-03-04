import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  filters?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters,
  actions,
  className,
}: FilterBarProps) {
  return (
    <div className={cn('flex items-center gap-2 px-4 py-2 border-b bg-background', className)}>
      {onSearchChange !== undefined && (
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
      )}
      {filters && <div className="flex items-center gap-2">{filters}</div>}
      <div className="ml-auto flex items-center gap-2">{actions}</div>
    </div>
  )
}
