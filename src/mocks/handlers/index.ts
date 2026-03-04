import { userHandlers } from './users'
import { analyticsHandlers } from './analytics'
import { inventoryHandlers } from './inventory'
import { crmHandlers } from './crm'

export const handlers = [
  ...userHandlers,
  ...analyticsHandlers,
  ...inventoryHandlers,
  ...crmHandlers,
]
