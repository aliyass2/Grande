import { Bell, Package, DollarSign, Users, ShoppingCart, Settings, UserCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useNotifications } from './useNotifications'
import type { AppNotification, NotificationCategory } from './types'

const CATEGORY_ICON: Record<NotificationCategory, React.ReactNode> = {
  inventory: <Package className="h-3.5 w-3.5" />,
  finance: <DollarSign className="h-3.5 w-3.5" />,
  crm: <Users className="h-3.5 w-3.5" />,
  sales: <ShoppingCart className="h-3.5 w-3.5" />,
  users: <UserCheck className="h-3.5 w-3.5" />,
  system: <Settings className="h-3.5 w-3.5" />,
}

const CATEGORY_COLOR: Record<NotificationCategory, string> = {
  inventory: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  finance: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  crm: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  sales: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
  users: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400',
  system: 'bg-muted text-muted-foreground',
}

function NotificationItem({
  notification,
  onRead,
}: {
  notification: AppNotification
  onRead: (id: string) => void
}) {
  const navigate = useNavigate()

  function handleClick() {
    if (!notification.read) onRead(notification.id)
    if (notification.link) navigate(notification.link)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50',
        !notification.read && 'bg-primary/5',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
          CATEGORY_COLOR[notification.category],
        )}
      >
        {CATEGORY_ICON[notification.category]}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              'truncate text-xs',
              notification.read ? 'font-normal text-foreground' : 'font-semibold text-foreground',
            )}
          >
            {notification.title}
          </p>
          <span className="shrink-0 text-[10px] text-muted-foreground">
            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
          {notification.body}
        </p>
      </div>

      {!notification.read && (
        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  )
}

export function NotificationPanel() {
  const { data: notifications = [], unreadCount, markRead, markAllRead } = useNotifications()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold leading-none text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[360px] p-0" sideOffset={6}>
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium leading-none text-primary-foreground">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
              onClick={markAllRead}
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* List */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
            <Bell className="h-8 w-8 opacity-30" />
            <p className="text-xs">No notifications</p>
          </div>
        ) : (
          <ScrollArea className="h-[360px]">
            <div className="divide-y">
              {notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} onRead={markRead} />
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  )
}
