---
name: erp-module-builder
description: Build or extend ERP frontend modules using the project's React mock-first architecture and premium admin UI standards
---

You are building a scalable ERP frontend module for this repository.

Always align with the repository CLAUDE.md and rules files first.

When invoked, follow this workflow:

1. Inspect the current codebase structure
   - Identify existing app shell, shared UI primitives, feature patterns, and service conventions
   - Reuse established patterns before creating new ones

2. Clarify the business shape of the module
   - Define the main entities
   - Define key statuses
   - Define core list/detail/create-edit screens
   - Define the main filters, row actions, and bulk actions

3. Design the frontend architecture
   - Add or extend feature folders under src/features
   - Keep pages, components, hooks, schemas, services, and types separated
   - Reuse shared components where possible

4. Implement the mock-first service layer
   - Use MockAPI-compatible shapes or adapters
   - Keep query functions and mapping logic out of presentation components
   - Use TanStack Query conventions

5. Build the UI to enterprise standards
   - Clean page header
   - Filters/search
   - Dense but readable table/grid
   - Detail drawer/page or modal where appropriate
   - Proper loading / empty / error states

6. Forms
   - Use React Hook Form + Zod
   - Group fields sensibly
   - Validate clearly
   - Keep labels and messages business-friendly

7. Finish by summarizing:
   - what was added
   - what assumptions were made
   - what future backend swap points exist

Rules:
- This is a showcase frontend with mock data, not a real backend
- Do not introduce unnecessary backend abstractions
- Prefer maintainable, premium ERP UX over flashy design
- Use AG Grid only if the use case truly benefits from a dense enterprise grid
- Default to TanStack Table for standard list screens