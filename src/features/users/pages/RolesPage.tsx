import { Users, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/PageHeader'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { useRoles } from '../hooks/useUsers'
import type { Permission } from '../types'

const RESOURCE_COLORS: Record<string, string> = {
  users: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  roles: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  inventory: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  crm: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
}

function PermissionTag({ perm }: { perm: Permission }) {
  const color = RESOURCE_COLORS[perm.resource] ?? 'bg-gray-100 text-gray-800'
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${color}`}>
      {perm.label}
    </span>
  )
}

export default function RolesPage() {
  const { data: roles, isLoading, isError, refetch } = useRoles()

  if (isLoading) return <LoadingSkeleton rows={3} />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Roles & Permissions"
        description="Manage access control and permission sets for your team."
      />

      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        {roles?.map((role) => (
          <Card key={role.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{role.name}</CardTitle>
                    <CardDescription className="text-xs">{role.description}</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">
                  <Users className="mr-1 h-3 w-3" />
                  {role.userCount}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Permissions</p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.map((p) => (
                  <PermissionTag key={p.id} perm={p} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
