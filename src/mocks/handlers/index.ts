import { userHandlers } from './users'
import { analyticsHandlers } from './analytics'
import { inventoryHandlers } from './inventory'
import { crmHandlers } from './crm'
import { financeHandlers } from './finance'
import { salesHandlers } from './sales'

export const handlers = [
  ...userHandlers,
  ...analyticsHandlers,
  ...inventoryHandlers,
  ...crmHandlers,
  ...financeHandlers,
  ...salesHandlers,
]
