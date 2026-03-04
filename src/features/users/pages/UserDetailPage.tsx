import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Building2, Shield, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/StatusBadge'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { formatDate, formatRelative, formatDateTime } from '@/lib/formatters'
import { useUser, useAuditLogs } from '../hooks/useUsers'

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: user, isLoading, isError } = useUser(id!)
  const { data: logs } = useAuditLogs({ userId: id, pageSize: 20 })

  if (isLoading) return <LoadingSkeleton />
  if (isError || !user) return <ErrorState onRetry={() => navigate('/users')} />

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <div className="flex flex-col gap-0">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-base font-semibold">{user.name}</h1>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="ml-3">
          <StatusBadge status={user.status} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-6">
        {/* Left column — details */}
        <div className="col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Profile Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div>
                  <dt className="text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-3 w-3" /> Email
                  </dt>
                  <dd className="mt-0.5 font-medium">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="h-3 w-3" /> Department
                  </dt>
                  <dd className="mt-0.5 font-medium">{user.department}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground flex items-center gap-1.5">
                    <Shield className="h-3 w-3" /> Role
                  </dt>
                  <dd className="mt-0.5 font-medium capitalize">{user.role}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> Member since
                  </dt>
                  <dd className="mt-0.5 font-medium">{formatDate(user.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Last Login</dt>
                  <dd className="mt-0.5 font-medium">{formatRelative(user.lastLoginAt)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {logs?.data.length ? (
                <div className="divide-y">
                  {logs.data.slice(0, 10).map((log) => (
                    <div key={log.id} className="flex items-start gap-3 px-4 py-2.5">
                      <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{log.action}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {log.resource} · {log.resourceId}
                        </p>
                      </div>
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {formatDateTime(log.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-4 py-6 text-center text-xs text-muted-foreground">No activity found</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full h-8 text-xs justify-start">
                Edit Profile
              </Button>
              <Button variant="outline" size="sm" className="w-full h-8 text-xs justify-start">
                Change Role
              </Button>
              <Separator />
              <Button variant="outline" size="sm" className="w-full h-8 text-xs justify-start text-destructive hover:text-destructive">
                Suspend Account
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Access Info</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={user.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Role</span>
                <Badge variant="secondary" className="capitalize text-xs">{user.role}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last seen</span>
                <span className="font-medium">{formatRelative(user.lastLoginAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
