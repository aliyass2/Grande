import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreatePermission } from '../hooks/useUsers'

const KNOWN_RESOURCES = ['users', 'roles', 'inventory', 'crm', 'reports']
const ACTIONS = ['create', 'read', 'update', 'delete'] as const

function autoLabel(resource: string, action: string): string {
  if (!resource || !action) return ''
  const actionMap: Record<string, string> = { create: 'Create', read: 'View', update: 'Edit', delete: 'Delete' }
  const resourceLabel = resource.charAt(0).toUpperCase() + resource.slice(1)
  return `${actionMap[action] ?? action} ${resourceLabel}`
}

const schema = z.object({
  resource: z.string().min(1, 'Resource is required'),
  action: z.enum(['create', 'read', 'update', 'delete']),
  label: z.string().min(2, 'Label is required'),
})

type FormData = z.infer<typeof schema>

interface AddPermissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPermissionDialog({ open, onOpenChange }: AddPermissionDialogProps) {
  const create = useCreatePermission()

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { resource: '', action: 'read', label: '' },
  })

  const resource = watch('resource')
  const action = watch('action')

  const handleResourceChange = (val: string) => {
    setValue('resource', val)
    setValue('label', autoLabel(val, action))
  }

  const handleActionChange = (val: FormData['action']) => {
    setValue('action', val)
    setValue('label', autoLabel(resource, val))
  }

  const onSubmit = (data: FormData) => {
    create.mutate(data, {
      onSuccess: () => { reset(); onOpenChange(false) },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Permission</DialogTitle>
          <DialogDescription>Define a new permission that can be assigned to roles.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label className="text-xs">Resource</Label>
            <Select onValueChange={handleResourceChange}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select or type a resource..." />
              </SelectTrigger>
              <SelectContent>
                {KNOWN_RESOURCES.map(r => (
                  <SelectItem key={r} value={r} className="text-xs capitalize">{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Also allow custom resource */}
            <Input
              className="h-8 text-xs mt-1"
              placeholder="Or enter a custom resource name"
              onChange={(e) => handleResourceChange(e.target.value)}
            />
            {errors.resource && <p className="text-xs text-destructive">{errors.resource.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Action</Label>
            <Select defaultValue="read" onValueChange={(v) => handleActionChange(v as FormData['action'])}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTIONS.map(a => (
                  <SelectItem key={a} value={a} className="text-xs capitalize">{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.action && <p className="text-xs text-destructive">{errors.action.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="perm-label" className="text-xs">Display Label</Label>
            <Input id="perm-label" {...register('label')} className="h-8 text-xs" placeholder="e.g. View Reports" />
            {errors.label && <p className="text-xs text-destructive">{errors.label.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => { reset(); onOpenChange(false) }}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={create.isPending}>
              {create.isPending ? 'Creating...' : 'Create Permission'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
