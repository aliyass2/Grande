---
paths:
  - "src/**/*.{ts,tsx}"
---

# Frontend UI Rules

## Component style
- Prefer shadcn/ui primitives and compose from them
- Keep components small and business-readable
- Extract shared patterns once duplication appears twice or more
- Favor typed props and explicit names

## ERP aesthetic
- Dense layouts are good if readability is preserved
- Tables are first-class
- Use cards for summaries, not for everything
- Favor muted, professional status colors
- Avoid oversized headings and oversized paddings on admin screens

## Page structure
Most module pages should follow:
1. page header
2. actions
3. filters
4. data presentation
5. supporting drawer/modal/detail actions

## State handling
- Use TanStack Query for async data sources
- Keep query keys organized by feature
- Keep transformations close to the feature
- Do not scatter mock-fetch logic directly inside page components

## Accessibility
- Dialogs, dropdowns, comboboxes, and tables must be keyboard-usable
- Use clear labels
- Keep contrast strong enough for enterprise use