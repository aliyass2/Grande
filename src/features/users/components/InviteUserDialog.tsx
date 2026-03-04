import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateUser } from '../hooks/useUsers'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  role: z.enum(['admin', 'manager', 'analyst', 'viewer']),
  department: z.string().min(1, 'Select a department'),
})

type FormData = z.infer<typeof schema>

interface InviteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteUserDialog({ open, onOpenChange }: InviteUserDialogProps) {
  const create = useCreateUser()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'viewer', department: '' },
  })

  const onSubmit = (data: FormData) => {
    create.mutate(
      { ...data, status: 'active', lastLoginAt: new Date().toISOString(), createdAt: new Date().toISOString() },
      {
        onSuccess: () => {
          reset()
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>Send an invitation to a new team member.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs">Full Name</Label>
            <Input id="name" {...register('name')} className="h-8 text-xs" placeholder="Jane Smith" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs">Email Address</Label>
            <Input id="email" type="email" {...register('email')} className="h-8 text-xs" placeholder="jane@company.com" />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Role</Label>
              <Select onValueChange={(v) => setValue('role', v as FormData['role'])} defaultValue="viewer">
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin" className="text-xs">Admin</SelectItem>
                  <SelectItem value="manager" className="text-xs">Manager</SelectItem>
                  <SelectItem value="analyst" className="text-xs">Analyst</SelectItem>
                  <SelectItem value="viewer" className="text-xs">Viewer</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Department</Label>
              <Select onValueChange={(v) => setValue('department', v)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations', 'HR', 'Legal'].map(d => (
                    <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && <p className="text-xs text-destructive">{errors.department.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={create.isPending}>
              {create.isPending ? 'Sending...' : 'Send Invite'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
