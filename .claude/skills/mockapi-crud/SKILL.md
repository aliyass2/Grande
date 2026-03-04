---
name: mockapi-crud
description: Create or refactor CRUD flows around MockAPI for the ERP showcase without introducing real backend complexity
---

Build CRUD behavior around MockAPI and mock helpers for this frontend showcase.

When invoked:

1. Inspect the target feature's existing types and UI
2. Define or refine:
   - entity type
   - form schema
   - list mapping
   - detail mapping
3. Create a feature-local service layer with clear functions such as:
   - getList
   - getById
   - create
   - update
   - remove
4. Integrate with TanStack Query
5. Ensure loading, empty, error, and optimistic-feeling states are present where appropriate
6. Keep all logic compatible with future replacement by a real backend

Never:
- introduce server-only logic
- add fake complexity that belongs to a backend
- tightly couple page components to raw mock payloads

Always leave the code cleaner and more replaceable than before.