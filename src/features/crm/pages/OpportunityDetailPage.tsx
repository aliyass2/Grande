import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, User, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/StatusBadge'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { Progress } from '@/components/ui/progress'
import { formatCurrency, formatDate, formatRelative } from '@/lib/formatters'
import { useOpportunity, useActivities } from '../hooks/useCrm'

const STAGE_ORDER = ['prospect', 'proposal', 'negotiation', 'closed_won', 'closed_lost']

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: opp, isLoading, isError } = useOpportunity(id!)
  const { data: activities } = useActivities({ relatedToId: id, pageSize: 15 })

  if (isLoading) return <LoadingSkeleton />
  if (isError || !opp) return <ErrorState onRetry={() => navigate('/crm/pipeline')} />

  const stageIndex = STAGE_ORDER.indexOf(opp.stage)

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/crm/pipeline')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-base font-semibold">{opp.title}</h1>
          <p className="text-xs text-muted-foreground">{opp.companyName}</p>
        </div>
        <StatusBadge status={opp.stage} />
      </div>

      <div className="grid grid-cols-3 gap-4 p-6">
        <div className="col-span-2 space-y-4">
          {/* Stage Progress */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Stage Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1.5">
                {['Prospect', 'Proposal', 'Negotiation', 'Closed Won'].map((stage, i) => (
                  <div key={stage} className="flex items-center gap-1.5 flex-1">
                    <div className={`h-2 flex-1 rounded-full ${i <= Math.min(stageIndex, 3) && opp.stage !== 'closed_lost' ? 'bg-primary' : 'bg-muted'}`} />
                    {i < 3 && null}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
                <span>Prospect</span>
                <span>Proposal</span>
                <span>Negotiation</span>
                <span>Closed Won</span>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  Deal Value
                </div>
                <p className="text-2xl font-bold">{formatCurrency(opp.value)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Probability
                </div>
                <p className="text-2xl font-bold">{opp.probability}%</p>
                <Progress value={opp.probability} className="mt-1.5 h-1" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Close Date
                </div>
                <p className="text-sm font-bold">{formatDate(opp.expectedCloseDate)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Timeline */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {activities?.data.length ? (
                <div className="divide-y">
                  {activities.data.map((act) => (
                    <div key={act.id} className="flex items-start gap-3 px-4 py-2.5">
                      <Badge variant="outline" className="text-[10px] capitalize shrink-0">{act.type}</Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{act.subject}</p>
                        <p className="text-[11px] text-muted-foreground">{act.performedBy}</p>
                      </div>
                      <span className="text-[11px] text-muted-foreground shrink-0">{formatRelative(act.timestamp)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-4 py-6 text-center text-xs text-muted-foreground">No activity</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Related Records</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2.5">
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-[10px]">Company</p>
                  <p className="font-medium">{opp.companyName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-[10px]">Contact</p>
                  <p
                    className="font-medium cursor-pointer text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => navigate(`/crm/contacts/${opp.contactId}`)}
                  >
                    {opp.contactName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-[10px]">Assigned To</p>
                  <p className="font-medium">{opp.assignedTo}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{formatDate(opp.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected close</span>
                <span className="font-medium">{formatDate(opp.expectedCloseDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weighted value</span>
                <span className="font-medium">{formatCurrency(opp.value * opp.probability / 100)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
