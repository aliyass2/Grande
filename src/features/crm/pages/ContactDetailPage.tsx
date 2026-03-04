import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Building2, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { StatusBadge } from '@/components/StatusBadge'
import { formatDate, formatDateTime, formatRelative } from '@/lib/formatters'
import { useContact, useOpportunities, useActivities } from '../hooks/useCrm'

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: contact, isLoading, isError } = useContact(id!)
  const { data: opportunities } = useOpportunities({ contactId: id, pageSize: 10 })
  const { data: activities } = useActivities({ relatedToId: id, pageSize: 15 })

  if (isLoading) return <LoadingSkeleton />
  if (isError || !contact) return <ErrorState onRetry={() => navigate('/crm/contacts')} />

  const initials = `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase()

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/crm/contacts')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-base font-semibold">{contact.firstName} {contact.lastName}</h1>
          <p className="text-xs text-muted-foreground">{contact.title} · {contact.companyName}</p>
        </div>
        <div className="ml-3 flex gap-1">
          {contact.tags.map(t => <Badge key={t} variant="secondary" className="text-xs capitalize">{t}</Badge>)}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-6">
        <div className="col-span-2 space-y-4">
          {/* Opportunities */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Opportunities ({opportunities?.total ?? 0})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {opportunities?.data.length ? (
                <div className="divide-y">
                  {opportunities.data.map((opp) => (
                    <div
                      key={opp.id}
                      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-muted/30"
                      onClick={() => navigate(`/crm/opportunities/${opp.id}`)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{opp.title}</p>
                        <p className="text-[11px] text-muted-foreground">{opp.companyName}</p>
                      </div>
                      <StatusBadge status={opp.stage} />
                      <span className="text-xs font-semibold">${(opp.value / 1000).toFixed(0)}k</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-4 py-6 text-center text-xs text-muted-foreground">No opportunities</p>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent Activity</CardTitle>
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
              <CardTitle className="text-sm">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2.5">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="break-all">{contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>{contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="font-medium">{contact.companyName}</span>
              </div>
              {contact.linkedInUrl && (
                <div className="flex items-center gap-2">
                  <Linkedin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <a href={contact.linkedInUrl} className="text-blue-600 hover:underline truncate" target="_blank" rel="noopener noreferrer">
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Meta</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last activity</span>
                <span className="font-medium">{formatRelative(contact.lastActivityAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{formatDate(contact.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
