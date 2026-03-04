import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppLayout } from './layout/AppLayout'

function Loading() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

function lazy_(factory: () => Promise<{ default: React.ComponentType }>) {
  const Component = lazy(factory)
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/analytics" replace /> },
      // Analytics
      { path: 'analytics', element: lazy_(() => import('@/features/analytics/pages/AnalyticsDashboardPage')) },
      { path: 'reports', element: lazy_(() => import('@/features/analytics/pages/ReportsPage')) },
      { path: 'reports/:id', element: lazy_(() => import('@/features/analytics/pages/ReportDetailPage')) },
      // Users
      { path: 'users', element: lazy_(() => import('@/features/users/pages/UsersPage')) },
      { path: 'users/:id', element: lazy_(() => import('@/features/users/pages/UserDetailPage')) },
      { path: 'roles', element: lazy_(() => import('@/features/users/pages/RolesPage')) },
      { path: 'audit-logs', element: lazy_(() => import('@/features/users/pages/AuditLogsPage')) },
      // Inventory
      { path: 'inventory/items', element: lazy_(() => import('@/features/inventory/pages/InventoryItemsPage')) },
      { path: 'inventory/items/:id', element: lazy_(() => import('@/features/inventory/pages/InventoryItemDetailPage')) },
      { path: 'inventory/warehouses', element: lazy_(() => import('@/features/inventory/pages/WarehousesPage')) },
      { path: 'inventory/movements', element: lazy_(() => import('@/features/inventory/pages/StockMovementsPage')) },
      // CRM
      { path: 'crm/leads', element: lazy_(() => import('@/features/crm/pages/LeadsPage')) },
      { path: 'crm/contacts', element: lazy_(() => import('@/features/crm/pages/ContactsPage')) },
      { path: 'crm/contacts/:id', element: lazy_(() => import('@/features/crm/pages/ContactDetailPage')) },
      { path: 'crm/companies', element: lazy_(() => import('@/features/crm/pages/CompaniesPage')) },
      { path: 'crm/pipeline', element: lazy_(() => import('@/features/crm/pages/PipelinePage')) },
      { path: 'crm/opportunities/:id', element: lazy_(() => import('@/features/crm/pages/OpportunityDetailPage')) },
    ],
  },
])
