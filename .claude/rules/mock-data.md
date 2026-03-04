---
paths:
  - "src/**/*.{ts,tsx}"
---

# Mock Data Rules

## Source of truth
This project currently uses MockAPI and mock helpers only.
Do not add a real backend unless explicitly requested.

## Mock data quality
Mock data should look believable and demo-ready:
- realistic names and business entities
- realistic timestamps
- consistent IDs, codes, and statuses
- meaningful empty states where some datasets are sparse

## API design
Even though data is mocked:
- shape services like real service clients
- keep DTOs and domain mapping clear
- avoid coupling UI components directly to raw mock payloads
- make it easy to replace mock endpoints later

## Error simulation
Where useful, include:
- loading delays
- empty responses
- validation failures
- failed fetch scenarios

The demo should feel realistic, not artificially perfect.