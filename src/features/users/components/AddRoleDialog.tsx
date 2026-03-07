import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useCreateRole, usePermissions } from '../hooks/useUsers'
import type { Permission } from '../types'

const ACTIONS = ['create', 'read', 'update', 'delete'] as const
const ACTION_LABELS: Record<string, string> = {
  create: 'Create', read: 'Read', update: 'Update', delete: 'Delete',
}

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(4, 'Provide a short description'),
  permissionIds: z.array(z.string()),
})

type FormData = z.infer<typeof schema>

interface AddRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddRoleDialog({ open, onOpenChange }: AddRoleDialogProps) {
  const create = useCreateRole()
  const { data: allPermissions = [] } = usePermissions()

  const resources = [...new Set(allPermissions.map(p => p.resource))].sort()

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', permissionIds: [] },
  })

  const onSubmit = (data: FormData) => {
    const permissions: Permission[] = allPermissions.filter(p => data.permissionIds.includes(p.id))
    create.mutate(
      { name: data.name, description: data.description, permissions },
      { onSuccess: () => { reset(); onOpenChange(false) } },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
          <DialogDescription>Define a new role and assign its permissions.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="role-name" className="text-xs">Role Name</Label>
            <Input id="role-name" {...register('name')} className="h-8 text-xs" placeholder="e.g. Support Agent" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role-desc" className="text-xs">Description</Label>
            <Textarea id="role-desc" {...register('description')} className="text-xs resize-none" rows={2} placeholder="What can this role do?" />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Permissions</Label>
            <div className="rounded-md border">
              {/* Header row */}
              <div className="grid border-b bg-muted/50 px-3 py-1.5" style={{ gridTemplateColumns: '1fr repeat(4, 5rem)' }}>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Resource</span>
                {ACTIONS.map(a => (
                  <span key={a} className="text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {ACTION_LABELS[a]}
                  </span>
                ))}
              </div>
              {/* Resource rows */}
              <Controller
                control={control}
                name="permissionIds"
                render={({ field }) => (
                  <div className="divide-y">
                    {resources.map(resource => (
                      <div
                        key={resource}
                        className="grid items-center px-3 py-2"
                        style={{ gridTemplateColumns: '1fr repeat(4, 5rem)' }}
                      >
                        <span className="text-xs font-medium capitalize">{resource}</span>
                        {ACTIONS.map(action => {
                          const perm = allPermissions.find(p => p.resource === resource && p.action === action)
                          if (!perm) return <div key={action} />
                          const checked = field.value.includes(perm.id)
                          return (
                            <div key={action} className="flex justify-center">
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(val) => {
                                  field.onChange(
                                    val
                                      ? [...field.value, perm.id]
                                      : field.value.filter(id => id !== perm.id)
                                  )
                                }}
                              />
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => { reset(); onOpenChange(false) }}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={create.isPending}>
              {create.isPending ? 'Creating...' : 'Create Role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
