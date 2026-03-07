import { useState } from 'react'
import { Plus, Users, ShieldCheck, Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/PageHeader'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { useRoles, usePermissions } from '../hooks/useUsers'
import { AddRoleDialog } from '../components/AddRoleDialog'
import { AddPermissionDialog } from '../components/AddPermissionDialog'
import type { Permission } from '../types'

const RESOURCE_COLORS: Record<string, string> = {
  users:     'bg-blue-600 text-white',
  roles:     'bg-purple-600 text-white',
  inventory: 'bg-emerald-600 text-white',
  crm:       'bg-orange-500 text-white',
  reports:   'bg-sky-600 text-white',
}

function PermissionTag({ perm }: { perm: Permission }) {
  const color = RESOURCE_COLORS[perm.resource] ?? 'bg-slate-600 text-white'
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${color}`}>
      {perm.label}
    </span>
  )
}

export default function RolesPage() {
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [permDialogOpen, setPermDialogOpen] = useState(false)

  const { data: roles, isLoading: rolesLoading, isError: rolesError, refetch: refetchRoles } = useRoles()
  const { data: permissions, isLoading: permsLoading, isError: permsError, refetch: refetchPerms } = usePermissions()

  if (rolesLoading || permsLoading) return <LoadingSkeleton rows={3} />
  if (rolesError || permsError) return <ErrorState onRetry={() => { refetchRoles(); refetchPerms() }} />

  const byResource = (permissions ?? []).reduce<Record<string, Permission[]>>((acc, p) => {
    if (!acc[p.resource]) acc[p.resource] = []
    acc[p.resource].push(p)
    return acc
  }, {})

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Roles & Permissions"
        description="Manage access control and permission sets for your team."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setPermDialogOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Permission
            </Button>
            <Button size="sm" onClick={() => setRoleDialogOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Role
            </Button>
          </div>
        }
      />

      {/* Roles grid */}
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

      {/* Permissions catalogue */}
      <div className="border-t px-6 py-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Permission Catalogue</h2>
          </div>
          <span className="text-xs text-muted-foreground">{permissions?.length ?? 0} permissions across {Object.keys(byResource).length} resources</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(byResource).map(([resource, perms]) => (
            <div key={resource} className="rounded-md border p-3">
              <p className="mb-2 text-xs font-semibold capitalize text-foreground">{resource}</p>
              <div className="flex flex-wrap gap-1">
                {perms.map(p => <PermissionTag key={p.id} perm={p} />)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddRoleDialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen} />
      <AddPermissionDialog open={permDialogOpen} onOpenChange={setPermDialogOpen} />
    </div>
  )
}
