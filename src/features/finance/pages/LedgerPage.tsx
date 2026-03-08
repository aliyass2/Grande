import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/PageHeader'
import { FilterBar } from '@/components/FilterBar'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { StatusBadge } from '@/components/StatusBadge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { useJournalEntries, usePnL, useBalanceSheet } from '../hooks/useFinance'
import type { JournalEntry, PnLRow, BalanceSheetRow } from '../types'

// ─── Journal Entries Table ─────────────────────────────────────────────────────

const STATUS_CLASSES: Record<string, string> = {
  posted: 'text-emerald-700 bg-emerald-500/10',
  draft:  'text-amber-700  bg-amber-500/10',
  voided: 'text-rose-700   bg-rose-500/10',
}

function JournalEntriesTable({ entries }: { entries: JournalEntry[] }) {
  return (
    <div className="rounded border text-sm overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/40">
            {['Date', 'Reference', 'Description', 'Debit Account', 'Credit Account', 'Amount', 'Status', 'Created By'].map(h => (
              <th key={h} className="px-3 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {entries.map(e => (
            <tr key={e.id} className="hover:bg-muted/20">
              <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">{formatDate(e.date)}</td>
              <td className="px-3 py-2 text-xs font-mono font-medium whitespace-nowrap">{e.reference}</td>
              <td className="px-3 py-2 text-xs max-w-[220px] truncate">{e.description}</td>
              <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                <span className="font-mono text-[11px] mr-1">{e.debitAccountCode}</span>{e.debitAccountName}
              </td>
              <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                <span className="font-mono text-[11px] mr-1">{e.creditAccountCode}</span>{e.creditAccountName}
              </td>
              <td className="px-3 py-2 text-xs font-semibold tabular-nums whitespace-nowrap text-right">{formatCurrency(e.amount)}</td>
              <td className="px-3 py-2">
                <span className={cn('inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium capitalize', STATUS_CLASSES[e.status] ?? '')}>
                  {e.status}
                </span>
              </td>
              <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">{e.createdBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── P&L Statement ─────────────────────────────────────────────────────────────

function PnLTable({ rows }: { rows: PnLRow[] }) {
  return (
    <div className="rounded border divide-y text-sm">
      <div className="grid grid-cols-3 gap-4 px-4 py-2 bg-muted/40 text-xs font-medium text-muted-foreground">
        <span>Description</span>
        <span className="text-right">FY 2025 (YTD)</span>
        <span className="text-right">FY 2024</span>
      </div>
      {rows.map((row, i) => {
        if (row.isSection) {
          return (
            <div key={i} className="grid grid-cols-3 gap-4 px-4 py-1.5 bg-muted/20">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide col-span-3">{row.label}</span>
            </div>
          )
        }
        const isNeg = row.current < 0
        return (
          <div
            key={i}
            className={cn(
              'grid grid-cols-3 gap-4 px-4 py-2',
              row.isBold && 'bg-muted/30',
            )}
          >
            <span className={cn('text-xs', row.isIndented && 'pl-4', row.isBold && 'font-semibold')}>
              {row.label}
            </span>
            <span className={cn(
              'text-right text-xs tabular-nums',
              row.isBold && 'font-semibold',
              isNeg && 'text-rose-600',
            )}>
              {row.current === 0 && row.isSection ? '' : formatCurrency(Math.abs(row.current))}
              {isNeg && row.current !== 0 ? ' (loss)' : ''}
            </span>
            <span className={cn(
              'text-right text-xs tabular-nums text-muted-foreground',
              row.isBold && 'font-medium',
            )}>
              {row.prior === 0 && row.isSection ? '' : formatCurrency(Math.abs(row.prior))}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Balance Sheet ─────────────────────────────────────────────────────────────

function BalanceSheetSection({ title, rows }: { title: string; rows: BalanceSheetRow[] }) {
  return (
    <div className="rounded border divide-y text-sm">
      <div className="px-4 py-2 bg-muted/40 text-xs font-semibold">{title}</div>
      {rows.map((row, i) => {
        if (row.isSection) {
          return (
            <div key={i} className="px-4 py-1.5 bg-muted/20">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{row.label}</span>
            </div>
          )
        }
        const isNeg = row.amount < 0
        return (
          <div key={i} className={cn('flex items-center justify-between px-4 py-2', row.isBold && 'bg-muted/30')}>
            <span className={cn('text-xs', row.isIndented && 'pl-4', row.isBold && 'font-semibold')}>{row.label}</span>
            <span className={cn(
              'text-xs tabular-nums',
              row.isBold && 'font-semibold',
              isNeg && 'text-rose-600',
            )}>
              {row.amount === 0 ? '' : `${isNeg ? '(' : ''}${formatCurrency(Math.abs(row.amount))}${isNeg ? ')' : ''}`}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function LedgerPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const { data: jeData, isLoading: jeLoading, isError: jeError, refetch: jeRefetch } = useJournalEntries({
    search: search || undefined,
    status: status || undefined,
  })
  const { data: pnlData, isLoading: pnlLoading } = usePnL()
  const { data: bsData, isLoading: bsLoading } = useBalanceSheet()

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="General Ledger"
        description="Journal entries, income statement, and balance sheet"
      />

      <Tabs defaultValue="journal" className="flex flex-col flex-1 overflow-hidden">
        <div className="border-b px-6">
          <TabsList className="h-9 rounded-none bg-transparent p-0 gap-0">
            {(['journal', 'pnl', 'balance-sheet'] as const).map((v, i) => (
              <TabsTrigger
                key={v}
                value={v}
                className="rounded-none border-b-2 border-transparent px-4 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {['Journal Entries', 'Income Statement', 'Balance Sheet'][i]}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* ── Journal Entries ── */}
        <TabsContent value="journal" className="flex flex-col flex-1 overflow-hidden m-0">
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search reference, description, account..."
            filters={
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" " className="text-xs">All statuses</SelectItem>
                  <SelectItem value="posted" className="text-xs">Posted</SelectItem>
                  <SelectItem value="draft" className="text-xs">Draft</SelectItem>
                  <SelectItem value="voided" className="text-xs">Voided</SelectItem>
                </SelectContent>
              </Select>
            }
          />
          {jeLoading ? (
            <LoadingSkeleton />
          ) : jeError ? (
            <ErrorState onRetry={() => jeRefetch()} />
          ) : (
            <div className="flex-1 overflow-auto px-6 pb-6">
              <div className="text-xs text-muted-foreground mb-2">{jeData?.total ?? 0} entries</div>
              <JournalEntriesTable entries={jeData?.data ?? []} />
            </div>
          )}
        </TabsContent>

        {/* ── Income Statement ── */}
        <TabsContent value="pnl" className="flex-1 overflow-auto m-0 p-6">
          {pnlLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="max-w-2xl space-y-4">
              <div>
                <h2 className="text-sm font-semibold">Income Statement</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Year-to-date vs prior full year · USD</p>
              </div>
              {pnlData && <PnLTable rows={pnlData} />}
            </div>
          )}
        </TabsContent>

        {/* ── Balance Sheet ── */}
        <TabsContent value="balance-sheet" className="flex-1 overflow-auto m-0 p-6">
          {bsLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="max-w-2xl space-y-4">
              <div>
                <h2 className="text-sm font-semibold">Balance Sheet</h2>
                <p className="text-xs text-muted-foreground mt-0.5">As of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · USD</p>
              </div>
              {bsData && (
                <div className="space-y-4">
                  <BalanceSheetSection title="Assets" rows={bsData.assets} />
                  <BalanceSheetSection title="Liabilities" rows={bsData.liabilities} />
                  <BalanceSheetSection title="Shareholders' Equity" rows={bsData.equity} />
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
