import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/formatters'
import { useOpportunities, useUpdateOpportunity } from '../hooks/useCrm'
import type { Opportunity } from '../types'

const STAGES: { key: Opportunity['stage']; label: string; next?: Opportunity['stage'] }[] = [
  { key: 'prospect', label: 'Prospect', next: 'proposal' },
  { key: 'proposal', label: 'Proposal', next: 'negotiation' },
  { key: 'negotiation', label: 'Negotiation', next: 'closed_won' },
  { key: 'closed_won', label: 'Closed Won' },
  { key: 'closed_lost', label: 'Closed Lost' },
]

const STAGE_COLORS: Record<Opportunity['stage'], string> = {
  prospect: 'border-t-blue-400',
  proposal: 'border-t-purple-400',
  negotiation: 'border-t-yellow-400',
  closed_won: 'border-t-green-400',
  closed_lost: 'border-t-red-400',
}

function OpportunityCard({ opp, nextStage }: { opp: Opportunity; nextStage?: Opportunity['stage'] }) {
  const navigate = useNavigate()
  const update = useUpdateOpportunity()

  return (
    <div
      className="rounded-md border bg-card p-2.5 cursor-pointer hover:shadow-sm transition-shadow text-xs"
      onClick={() => navigate(`/crm/opportunities/${opp.id}`)}
    >
      <p className="font-medium leading-tight line-clamp-2">{opp.title}</p>
      <p className="text-muted-foreground mt-1">{opp.companyName}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="font-semibold">{formatCurrency(opp.value)}</span>
        <span className="text-muted-foreground">{opp.probability}%</span>
      </div>
      {nextStage && (
        <button
          className="mt-2 flex items-center gap-0.5 text-[10px] text-blue-600 dark:text-blue-400 hover:underline"
          onClick={(e) => {
            e.stopPropagation()
            update.mutate({ id: opp.id, data: { stage: nextStage } })
          }}
        >
          Advance to {STAGES.find(s => s.key === nextStage)?.label}
          <ChevronRight className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

export default function PipelinePage() {
  const { data, isLoading, isError, refetch } = useOpportunities({ pageSize: 100 })

  if (isLoading) return <LoadingSkeleton rows={4} />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  const opps = data?.data ?? []

  const totalPipelineValue = opps
    .filter(o => o.stage !== 'closed_lost')
    .reduce((sum, o) => sum + o.value, 0)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Pipeline"
        description={`${opps.length} opportunities · ${formatCurrency(totalPipelineValue)} total pipeline value`}
      />

      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-3 min-w-max">
          {STAGES.map((stage) => {
            const stageOpps = opps.filter(o => o.stage === stage.key)
            const stageValue = stageOpps.reduce((sum, o) => sum + o.value, 0)

            return (
              <div key={stage.key} className={`w-56 shrink-0`}>
                {/* Column header */}
                <div className={`rounded-t-md border-t-2 ${STAGE_COLORS[stage.key]} border border-b-0 bg-muted/30 px-3 py-2`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{stage.label}</span>
                    <Badge variant="secondary" className="text-[10px]">{stageOpps.length}</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{formatCurrency(stageValue)}</p>
                </div>

                {/* Cards */}
                <div className="border border-t-0 rounded-b-md bg-muted/10 p-2 space-y-2 min-h-[200px]">
                  {stageOpps.map((opp) => (
                    <OpportunityCard key={opp.id} opp={opp} nextStage={stage.next} />
                  ))}
                  {stageOpps.length === 0 && (
                    <p className="text-center text-[10px] text-muted-foreground pt-6">No opportunities</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
