import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/PageHeader'
import { DataTable } from '@/components/DataTable'
import { FilterBar } from '@/components/FilterBar'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { usePricingRules, useUpdatePricingRule } from '../hooks/useSales'
import type { PricingRule } from '../types'

const TYPE_STYLES: Record<string, string> = {
  percentage_discount: 'text-blue-700 bg-blue-500/10 dark:text-blue-400',
  fixed_discount:      'text-amber-700 bg-amber-500/10 dark:text-amber-400',
  fixed_price:         'text-violet-700 bg-violet-500/10 dark:text-violet-400',
}

const TYPE_LABELS: Record<string, string> = {
  percentage_discount: '% Discount',
  fixed_discount:      '$ Off',
  fixed_price:         'Fixed Price',
}

function formatRuleValue(rule: PricingRule): string {
  if (rule.type === 'percentage_discount') return `${rule.value}% off`
  if (rule.type === 'fixed_discount') return `-${formatCurrency(rule.value)}`
  return formatCurrency(rule.value)
}

export default function PricingPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [scope, setScope] = useState('')

  const { data, isLoading, isError, refetch } = usePricingRules({
    search: search || undefined,
    type: type || undefined,
    scope: scope || undefined,
  })

  const updateRule = useUpdatePricingRule()

  const columns: ColumnDef<PricingRule>[] = [
    {
      accessorKey: 'name',
      header: 'Rule Name',
      cell: ({ getValue }) => <span className="text-xs font-medium">{getValue<string>()}</span>,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ getValue }) => {
        const t = getValue<string>()
        return (
          <span className={cn('inline-flex rounded px-1.5 py-0.5 text-[11px] font-medium', TYPE_STYLES[t] ?? '')}>
            {TYPE_LABELS[t] ?? t}
          </span>
        )
      },
    },
    {
      accessorKey: 'scope',
      header: 'Scope',
      cell: ({ getValue }) => (
        <span className="text-xs text-muted-foreground capitalize">
          {(getValue<string>()).replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      accessorKey: 'scopeLabel',
      header: 'Applies To',
      cell: ({ getValue }) => (
        <span className="font-mono text-[11px]">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'value',
      header: 'Value',
      cell: ({ row }) => (
        <span className="text-xs tabular-nums font-medium">{formatRuleValue(row.original)}</span>
      ),
    },
    {
      accessorKey: 'minQuantity',
      header: 'Min Qty',
      cell: ({ getValue }) => {
        const v = getValue<number | undefined>()
        return <span className="text-xs tabular-nums text-muted-foreground">{v ?? '—'}</span>
      },
    },
    {
      accessorKey: 'validFrom',
      header: 'Valid From',
      cell: ({ getValue }) => (
        <span className="text-xs text-muted-foreground">{formatDate(getValue<string>())}</span>
      ),
    },
    {
      accessorKey: 'validTo',
      header: 'Valid To',
      cell: ({ getValue }) => {
        const v = getValue<string | undefined>()
        return <span className="text-xs text-muted-foreground">{v ? formatDate(v) : '—'}</span>
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const rule = row.original
        return (
          <button
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer',
              rule.isActive
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
            onClick={e => {
              e.stopPropagation()
              updateRule.mutate({ id: rule.id, data: { isActive: !rule.isActive } })
            }}
          >
            {rule.isActive ? 'Active' : 'Inactive'}
          </button>
        )
      },
    },
  ]

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  const activeCount = data?.data.filter(r => r.isActive).length ?? 0

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Pricing Rules"
        description={`${activeCount} active · ${data?.total ?? 0} total`}
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search rule name or target..."
        filters={
          <>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" "                    className="text-xs">All types</SelectItem>
                <SelectItem value="percentage_discount"  className="text-xs">% Discount</SelectItem>
                <SelectItem value="fixed_discount"       className="text-xs">$ Off</SelectItem>
                <SelectItem value="fixed_price"          className="text-xs">Fixed Price</SelectItem>
              </SelectContent>
            </Select>
            <Select value={scope} onValueChange={setScope}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue placeholder="All scopes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" "              className="text-xs">All scopes</SelectItem>
                <SelectItem value="global"         className="text-xs">Global</SelectItem>
                <SelectItem value="customer_group" className="text-xs">Customer Group</SelectItem>
                <SelectItem value="product"        className="text-xs">Product</SelectItem>
                <SelectItem value="category"       className="text-xs">Category</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      <div className="flex-1 overflow-auto">
        <DataTable
          data={data?.data ?? []}
          columns={columns}
        />
      </div>
    </div>
  )
}
