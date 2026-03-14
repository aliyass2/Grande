export type NotificationCategory =
  | 'inventory'
  | 'finance'
  | 'crm'
  | 'sales'
  | 'users'
  | 'system'

export interface AppNotification {
  id: string
  category: NotificationCategory
  title: string
  body: string
  timestamp: string // ISO
  read: boolean
  link?: string
}
