# Grande ERP — System Summary

## Overview

**Grande** is a modern, enterprise-grade ERP frontend showcase built entirely in React with mock data. It is not connected to a real backend — all data is intercepted by MSW (Mock Service Worker) and served from in-memory seed data. The goal is to demonstrate scalable frontend architecture, premium ERP UI/UX, and module extensibility.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 (CSS-first, no config file) |
| UI Primitives | shadcn/ui (Radix UI based, manually scaffolded) |
| Routing | React Router v7 |
| Data Fetching | TanStack Query v5 |
| Tables (standard) | TanStack Table v8 |
| Tables (dense/enterprise) | AG Grid Community v33 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Mock API | MSW v2 |
| Toasts | Sonner |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── app/              # App shell, router, layout, providers, nav config
├── features/         # Feature modules (see below)
├── components/       # Shared reusable UI components
│   └── ui/           # shadcn/ui primitives
├── lib/              # Utilities, formatters, query client, constants
├── services/         # Shared HTTP fetcher (apiFetch)
├── types/            # Shared domain contracts (common.ts)
└── mocks/
    ├── data/         # Seed data generators per module
    ├── handlers/     # MSW request handlers per module
    └── helpers/      # Fake data utilities (dates, faker)
```

---

## Feature Modules

### Analytics (`/analytics`, `/reports`, `/reports/:id`)
- KPI summary cards
- Recharts trend charts (revenue, orders, customers)
- Report library with detail drilldown
- Segmented date range filters

### User Management (`/users`, `/users/:id`, `/roles`, `/audit-logs`)
- User list with TanStack Table (search, status filter, role filter)
- User detail page with metadata + activity history
- Roles page with permission matrix (RBAC mock)
- Audit logs with AG Grid (dense, high-volume view)
- Invite user, add role, add permission dialogs

### Inventory (`/inventory/items`, `/inventory/items/:id`, `/inventory/warehouses`, `/inventory/movements`)
- Items list with AG Grid (SKU, stock level, category, warehouse)
- Item detail with metadata + stock movement history
- Warehouses list with capacity indicators
- Stock movements log with filtering

### CRM (`/crm/leads`, `/crm/contacts`, `/crm/contacts/:id`, `/crm/companies`, `/crm/pipeline`, `/crm/opportunities/:id`)
- Leads list with status tracking and owner assignment
- Contacts list + contact detail with linked companies/opportunities
- Companies list
- Pipeline (Kanban board) with drag-and-drop opportunity stages
- Opportunity detail with timeline and related records

---

## Authentication

- Mock login page at `/login`
- `AuthProvider` wraps the app and holds a mock session
- `ProtectedRoute` redirects unauthenticated users to `/login`
- Mock user defined in `src/features/auth/mock-user.ts` — no real auth provider

---

## Shared Components

| Component | Purpose |
|---|---|
| `DataTable` | TanStack Table wrapper (sorting, pagination, row selection) |
| `PageHeader` | Title + action area used on every module page |
| `FilterBar` | Search + filter controls strip |
| `StatusBadge` | Auto-maps status strings to styled badge variants |
| `ConfirmDialog` | Reusable destructive-action confirmation dialog |
| `EmptyState` | Consistent empty data state display |
| `ErrorState` | Consistent fetch error display |
| `LoadingSkeleton` | Skeleton rows for loading states |

---

## Mock Data Layer

- MSW intercepts all API calls in the browser (`src/mocks/browser.ts` started in `main.tsx`)
- Handlers per module in `src/mocks/handlers/`
- Seed data in `src/mocks/data/` — realistic names, IDs, timestamps, statuses
- Responses follow a standard paginated shape: `{ data, total, page, pageSize }`
- Services (`src/features/*/services/`) are shaped like real API clients so they can be swapped for real endpoints later

---

## Data Flow

```
Page component
  → useXxx hook (TanStack Query)
    → feature service (e.g. userService.ts)
      → apiFetch (src/services/http.ts)
        → MSW handler intercepts
          → returns seed data
```

---

## Routing Summary

| Route | Module | View |
|---|---|---|
| `/analytics` | Analytics | KPI dashboard |
| `/reports` | Analytics | Report library |
| `/reports/:id` | Analytics | Report detail |
| `/users` | User Mgmt | User list |
| `/users/:id` | User Mgmt | User detail |
| `/roles` | User Mgmt | Roles & permissions |
| `/audit-logs` | User Mgmt | Audit log (AG Grid) |
| `/inventory/items` | Inventory | Items grid (AG Grid) |
| `/inventory/items/:id` | Inventory | Item detail |
| `/inventory/warehouses` | Inventory | Warehouses list |
| `/inventory/movements` | Inventory | Stock movements |
| `/crm/leads` | CRM | Leads list |
| `/crm/contacts` | CRM | Contacts list |
| `/crm/contacts/:id` | CRM | Contact detail |
| `/crm/companies` | CRM | Companies list |
| `/crm/pipeline` | CRM | Kanban pipeline |
| `/crm/opportunities/:id` | CRM | Opportunity detail |

---

## Design Principles

- **Dense, professional ERP aesthetic** — no consumer-app styling, no large paddings or flashy animations
- **Tables are first-class** — TanStack Table for standard lists, AG Grid only for truly enterprise-dense screens
- **Consistent page structure** — every module page: header → actions → filters → data → row actions
- **Keyboard-friendly** — dialogs, dropdowns, and tables are keyboard-accessible
- **Mock-first but backend-ready** — services and DTOs are shaped for easy real-API replacement

---

## Running Locally

```bash
npm install
npm run dev     # starts at http://localhost:5173
npm run build   # TypeScript check + Vite build
```

No environment variables required — MSW handles all API interception automatically in dev mode.
