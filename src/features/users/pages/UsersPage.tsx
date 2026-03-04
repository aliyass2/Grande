import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, UserX, Download } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/PageHeader'
import { DataTable } from '@/components/DataTable'
import { FilterBar } from '@/components/FilterBar'
import { StatusBadge } from '@/components/StatusBadge'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDate, formatRelative } from '@/lib/formatters'
import { useUsers } from '../hooks/useUsers'
import { InviteUserDialog } from '../components/InviteUserDialog'
import type { User } from '../types'

const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    header: 'User',
    cell: ({ row }) => {
      const u = row.original
      const initials = u.name.split(' ').map(n => n[0]).join('').toUpperCase()
      return (
        <div className="flex items-center gap-2.5">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-xs">{u.name}</p>
            <p className="text-[11px] text-muted-foreground">{u.email}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ getValue }) => (
      <span className="capitalize text-xs">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ getValue }) => <span className="text-xs">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge status={getValue<string>()} />,
  },
  {
    accessorKey: 'lastLoginAt',
    header: 'Last Login',
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">
        {formatRelative(getValue<string>())}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{formatDate(getValue<string>())}</span>
    ),
  },
]

export default function UsersPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [inviteOpen, setInviteOpen] = useState(false)

  const { data, isLoading, isError, refetch } = useUsers({
    search: search || undefined,
    role: role || undefined,
    status: status || undefined,
  })

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Users"
        description={`${data?.total ?? 0} users across all departments`}
        actions={
          <>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Download className="h-3.5 w-3.5 mr-1" />
              Export
            </Button>
            <Button size="sm" className="h-8 text-xs" onClick={() => setInviteOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Invite User
            </Button>
          </>
        }
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search users..."
        filters={
          <>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="h-8 w-32 text-xs">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" " className="text-xs">All roles</SelectItem>
                <SelectItem value="admin" className="text-xs">Admin</SelectItem>
                <SelectItem value="manager" className="text-xs">Manager</SelectItem>
                <SelectItem value="analyst" className="text-xs">Analyst</SelectItem>
                <SelectItem value="viewer" className="text-xs">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 w-32 text-xs">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" " className="text-xs">All statuses</SelectItem>
                <SelectItem value="active" className="text-xs">Active</SelectItem>
                <SelectItem value="inactive" className="text-xs">Inactive</SelectItem>
                <SelectItem value="suspended" className="text-xs">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
        actions={
          data && Object.keys(data).length > 0 ? (
            <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive hover:text-destructive">
              <UserX className="h-3.5 w-3.5 mr-1" />
              Bulk Suspend
            </Button>
          ) : null
        }
      />

      <div className="flex-1 overflow-auto">
        <DataTable
          data={data?.data ?? []}
          columns={columns}
          selectable
          onRowClick={(user) => navigate(`/users/${user.id}`)}
        />
      </div>

      <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  )
}
