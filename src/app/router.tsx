import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppLayout } from './layout/AppLayout'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import LoginPage from '@/features/auth/LoginPage'

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
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
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
      // Finance
      { path: 'finance/ledger',   element: lazy_(() => import('@/features/finance/pages/LedgerPage')) },
      { path: 'finance/invoices', element: lazy_(() => import('@/features/finance/pages/InvoicesPage')) },
      { path: 'finance/invoices/:id', element: lazy_(() => import('@/features/finance/pages/InvoiceDetailPage')) },
      { path: 'finance/bills',    element: lazy_(() => import('@/features/finance/pages/BillsPage')) },
      { path: 'finance/expenses', element: lazy_(() => import('@/features/finance/pages/ExpensesPage')) },
      // CRM
      { path: 'crm/leads', element: lazy_(() => import('@/features/crm/pages/LeadsPage')) },
      { path: 'crm/contacts', element: lazy_(() => import('@/features/crm/pages/ContactsPage')) },
      { path: 'crm/contacts/:id', element: lazy_(() => import('@/features/crm/pages/ContactDetailPage')) },
      { path: 'crm/companies', element: lazy_(() => import('@/features/crm/pages/CompaniesPage')) },
      { path: 'crm/pipeline', element: lazy_(() => import('@/features/crm/pages/PipelinePage')) },
      { path: 'crm/opportunities/:id', element: lazy_(() => import('@/features/crm/pages/OpportunityDetailPage')) },
      // Sales
      { path: 'sales/quotes',       element: lazy_(() => import('@/features/sales/pages/QuotesPage')) },
      { path: 'sales/quotes/:id',   element: lazy_(() => import('@/features/sales/pages/QuoteDetailPage')) },
      { path: 'sales/orders',       element: lazy_(() => import('@/features/sales/pages/SalesOrdersPage')) },
      { path: 'sales/orders/:id',   element: lazy_(() => import('@/features/sales/pages/OrderDetailPage')) },
      { path: 'sales/pricing',      element: lazy_(() => import('@/features/sales/pages/PricingPage')) },
        ],
      },
    ],
  },
])
