import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'
import { NAV_GROUPS } from '@/app/nav-config'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r bg-sidebar-background text-sidebar-foreground transition-all duration-200',
        collapsed ? 'w-14' : 'w-56',
      )}
    >
      {/* Logo */}
      <div className="flex h-12 items-center border-b border-sidebar-border px-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <LayoutGrid className="h-4 w-4" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight">Grande ERP</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-2">
        <nav className="px-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-3">
              {!collapsed && (
                <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                  {group.label}
                </p>
              )}
              {collapsed && <div className="mb-1 h-px bg-sidebar-border/50 mx-1" />}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const link = (
                    <NavLink
                      to={item.href}
                      end={item.href !== '/'}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                          collapsed && 'justify-center px-0',
                        )
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  )

                  return (
                    <li key={item.href}>
                      {collapsed ? (
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>{link}</TooltipTrigger>
                          <TooltipContent side="right">{item.label}</TooltipContent>
                        </Tooltip>
                      ) : (
                        link
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-16 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-background text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </aside>
  )
}
