import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LayoutGrid, Lock, User } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [authError, setAuthError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormValues) => {
    const ok = login(data.username, data.password)
    if (ok) {
      navigate('/analytics', { replace: true })
    } else {
      setAuthError(true)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[420px] flex-col justify-between p-10 bg-brand-900 text-white select-none">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center">
            <LayoutGrid className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Grande ERP</span>
        </div>

        <div>
          <h1 className="text-3xl font-semibold leading-snug tracking-tight mb-4">
            Enterprise operations,<br />unified.
          </h1>
          <p className="text-sm text-white/55 leading-relaxed">
            Manage inventory, CRM, analytics, and your workforce from a single, modern workspace built for scale.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { label: 'Modules', value: '4' },
              { label: 'Role levels', value: '4' },
              { label: 'Data sources', value: 'Live mock' },
              { label: 'Version', value: 'v1.0' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg bg-white/5 border border-white/8 px-4 py-3">
                <p className="text-lg font-semibold">{stat.value}</p>
                <p className="text-xs text-white/45 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/25">© 2026 Grande Corp. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-[360px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-7 w-7 rounded-md bg-brand-800 flex items-center justify-center">
              <LayoutGrid className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Grande ERP</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to your workspace to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  id="username"
                  className="pl-9"
                  autoComplete="username"
                  autoFocus
                  {...register('username')}
                  onChange={(e) => { setAuthError(false); register('username').onChange(e) }}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="pl-9 pr-9"
                  autoComplete="current-password"
                  {...register('password')}
                  onChange={(e) => { setAuthError(false); register('password').onChange(e) }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword
                    ? <EyeOff className="h-3.5 w-3.5" />
                    : <Eye className="h-3.5 w-3.5" />
                  }
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Auth error */}
            {authError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/8 px-3 py-2.5">
                <p className="text-xs text-destructive font-medium">
                  Invalid username or password. Please try again.
                </p>
              </div>
            )}

            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
              Sign in
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 rounded-md border border-dashed bg-muted/40 px-4 py-3">
            <p className="text-xs font-medium text-foreground mb-1">Demo credentials</p>
            <p className="text-xs text-muted-foreground font-mono">
              Username: <span className="text-foreground">admin</span>
              &nbsp;&nbsp;·&nbsp;&nbsp;
              Password: <span className="text-foreground">admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
