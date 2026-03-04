import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/PageHeader'
import { DataTable } from '@/components/DataTable'
import { FilterBar } from '@/components/FilterBar'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatRelative } from '@/lib/formatters'
import { useContacts } from '../hooks/useCrm'
import type { Contact } from '../types'

const columns: ColumnDef<Contact>[] = [
  {
    id: 'name',
    header: 'Contact',
    cell: ({ row }) => {
      const c = row.original
      const initials = `${c.firstName[0]}${c.lastName[0]}`.toUpperCase()
      return (
        <div className="flex items-center gap-2.5">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-xs">{c.firstName} {c.lastName}</p>
            <p className="text-[11px] text-muted-foreground">{c.email}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ getValue }) => <span className="text-xs">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'companyName',
    header: 'Company',
    cell: ({ getValue }) => (
      <span className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ getValue }) => (
      <div className="flex gap-1 flex-wrap">
        {(getValue<string[]>() ?? []).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-[10px] capitalize">{tag}</Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'lastActivityAt',
    header: 'Last Activity',
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{formatRelative(getValue<string>())}</span>
    ),
  },
]

export default function ContactsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const { data, isLoading, isError, refetch } = useContacts({
    search: search || undefined,
  })

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Contacts"
        description={`${data?.total ?? 0} contacts`}
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search name, email, company..."
      />

      <div className="flex-1 overflow-auto">
        <DataTable
          data={data?.data ?? []}
          columns={columns}
          onRowClick={(c) => navigate(`/crm/contacts/${c.id}`)}
        />
      </div>
    </div>
  )
}
