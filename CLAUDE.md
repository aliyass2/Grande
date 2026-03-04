# ERP Frontend Showcase Rules

## Project mission
Build a modern, enterprise-grade ERP frontend showcase in React using mock data only.
This repository is intended to demonstrate scalable frontend architecture, premium ERP UI/UX, and module extensibility.
Do not treat this as a full production backend system.

## Current scope
The current modules are:
- User Management & Roles (RBAC + audit logs)
- Reporting & Analytics / BI
- Inventory Management
- CRM

Future modules will be added later. Build in a way that supports expansion without major rewrites.

## Non-goals for now
- No real backend
- No real authentication provider
- No real authorization enforcement beyond mock/UI-level behavior
- No production API integration
- No server-side persistence
- No unnecessary backend abstractions that only make sense once a real API exists

## Required stack
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui for core UI primitives
- React Router for navigation
- TanStack Query for data fetching/state around MockAPI
- React Hook Form + Zod for forms
- TanStack Table for default tabular experiences
- AG Grid Community only for truly data-dense enterprise screens
- charting suitable for KPI dashboards and reports

## Design direction
The UI must feel like a premium modern ERP/admin product:
- clean
- dense
- highly usable
- consistent
- serious and business-oriented

Avoid:
- playful consumer-app styling
- overly large spacing
- excessive gradients
- flashy animations
- card overload where tables would be better
- inconsistent control styling

Prefer:
- structured sidebar navigation
- compact tables with good scanning
- sticky filter/action bars
- restrained color system
- clear status badges
- keyboard-friendly flows where practical
- obvious loading, empty, and error states

## Data policy
Treat data as mock-first.
Use MockAPI and local mock helpers.
Create realistic seed data that looks believable for demos:
- realistic names
- realistic IDs/codes
- realistic timestamps
- realistic statuses
- realistic warehouse, inventory, CRM, and audit events

All mock schemas should be designed so they can be replaced later by a real backend with minimal UI rewrite.

## Architecture rules
Use a feature-first modular structure.

Preferred high-level structure:
- src/app            -> app shell, providers, router
- src/features       -> module-specific code
- src/components     -> shared reusable UI components
- src/lib            -> utilities, query client, formatters, constants
- src/services       -> MockAPI clients and adapters
- src/types          -> shared domain contracts
- src/mocks          -> seed generators, mock transforms, fake helpers

Inside each feature, separate:
- pages
- components
- schemas
- hooks
- services
- types

Keep shared logic out of feature folders unless it is truly feature-specific.

## Implementation behavior
When asked to build something:
1. inspect existing structure first
2. propose the smallest scalable addition
3. implement with reusable abstractions
4. avoid duplication
5. keep naming business-oriented and clear

When adding a module:
- define domain entities first
- define list/detail/form views
- define table columns, filters, and actions
- define mock service layer
- then build pages and reusable subcomponents

## UI standards
For data-heavy pages:
- include page title + action area
- include filter/search bar
- include table/grid
- include row actions
- include bulk actions if appropriate
- include pagination or virtualized grid behavior as needed

For dashboards:
- include KPI summary cards
- include trend visualization
- include segmented filters/date ranges
- include drilldown panels or linked detail widgets where useful

For detail pages:
- include summary header
- include metadata sections
- include timeline/history where relevant
- include related records blocks

## Table strategy
Default to TanStack Table for:
- standard admin tables
- common list pages
- reusable, lightweight table experiences

Use AG Grid Community only when needed for:
- dense enterprise views
- advanced column interactions
- high-volume records
- richer grid ergonomics

Do not use AG Grid everywhere.

## Forms
Use React Hook Form + Zod.
All forms should have:
- schema validation
- field-level errors
- sensible default values
- loading/submitting states
- business-friendly labels
- clean section grouping for large forms

## Routing
Use route structure that maps cleanly to ERP modules.
Routes should be obvious and scalable, for example:
- /users
- /roles
- /audit-logs
- /analytics
- /reports
- /inventory/items
- /inventory/warehouses
- /crm/leads
- /crm/contacts
- /crm/pipeline

## Quality bar
Code should be:
- readable
- modular
- strongly typed
- easy to extend
- visually consistent

Prefer pragmatic solutions over clever ones.
Avoid premature complexity.
When unsure, choose the option that makes future module expansion easier.

## Output expectations
When completing tasks:
- explain important design choices briefly
- note assumptions
- keep changes aligned with the mock-first showcase goal
- do not drift into backend engineering unless explicitly asked