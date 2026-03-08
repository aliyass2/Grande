import {
  pick, weightedPick, randomInt, fullName, companyName, generateId,
} from '../helpers/faker'
import { daysAgo, daysFromNow } from '../helpers/dates'
import type { Quote, QuoteLineItem, SalesOrder, OrderLineItem, PricingRule } from '@/features/sales/types'

// ─── Product Catalog ──────────────────────────────────────────────────────────

const PRODUCTS = [
  { code: 'PROD-1010', description: 'Enterprise Platform License',          unitPrice: 4800  },
  { code: 'PROD-1020', description: 'Add-on – Analytics Module',            unitPrice: 1200  },
  { code: 'PROD-1030', description: 'Add-on – API Access',                  unitPrice:  800  },
  { code: 'PROD-2010', description: 'Professional Services (per day)',      unitPrice: 2000  },
  { code: 'PROD-2020', description: 'Implementation Package',               unitPrice: 8500  },
  { code: 'PROD-2030', description: 'Custom Integration – Basic',           unitPrice: 4200  },
  { code: 'PROD-2040', description: 'Custom Integration – Advanced',        unitPrice: 9800  },
  { code: 'PROD-3010', description: 'Support Contract – Standard',          unitPrice: 1800  },
  { code: 'PROD-3020', description: 'Support Contract – Priority',          unitPrice: 3600  },
  { code: 'PROD-3030', description: 'Support Contract – Dedicated',         unitPrice: 8400  },
  { code: 'PROD-4010', description: 'Remote Training – Half Day',           unitPrice: 1400  },
  { code: 'PROD-4020', description: 'Remote Training – Full Day',           unitPrice: 2200  },
  { code: 'PROD-4030', description: 'On-site Training (per day)',           unitPrice: 3500  },
  { code: 'PROD-5010', description: 'Server Hardware – Standard',           unitPrice: 5900  },
  { code: 'PROD-5020', description: 'Server Hardware – High Performance',   unitPrice: 12500 },
]

function generateQuoteLineItems(count: number): QuoteLineItem[] {
  const used = new Set<string>()
  const items: QuoteLineItem[] = []
  for (let j = 0; j < count; j++) {
    let p = pick(PRODUCTS)
    let attempts = 0
    while (used.has(p.code) && attempts < 10) { p = pick(PRODUCTS); attempts++ }
    used.add(p.code)
    const qty = randomInt(1, 5)
    const disc = pick([0, 0, 0, 5, 10, 15])
    const lineSubtotal = qty * p.unitPrice
    const lineTotal = parseFloat((lineSubtotal * (1 - disc / 100)).toFixed(2))
    items.push({
      id: `li_${j + 1}`,
      productCode: p.code,
      description: p.description,
      quantity: qty,
      unitPrice: p.unitPrice,
      discount: disc,
      total: lineTotal,
    })
  }
  return items
}

// ─── Quotes ───────────────────────────────────────────────────────────────────

export const MOCK_QUOTES: Quote[] = Array.from({ length: 80 }, (_, i) => {
  const customer = companyName()
  const contact = fullName()
  const lineItems = generateQuoteLineItems(randomInt(1, 4))
  const subtotal = parseFloat(lineItems.reduce((s, li) => s + li.quantity * li.unitPrice, 0).toFixed(2))
  const discountAmount = parseFloat((subtotal - lineItems.reduce((s, li) => s + li.total, 0)).toFixed(2))
  const taxableAmount = subtotal - discountAmount
  const tax = parseFloat((taxableAmount * 0.08).toFixed(2))
  const total = parseFloat((taxableAmount + tax).toFixed(2))
  const issueDate = i < 20 ? daysAgo(randomInt(0, 14)) : daysAgo(randomInt(15, 180))
  const expiryDate = daysFromNow(randomInt(14, 45))
  const status = weightedPick([
    { value: 'draft'     as const, weight: 18 },
    { value: 'sent'      as const, weight: 30 },
    { value: 'accepted'  as const, weight: 22 },
    { value: 'rejected'  as const, weight: 10 },
    { value: 'expired'   as const, weight: 12 },
    { value: 'converted' as const, weight:  8 },
  ])
  return {
    id: generateId('qt', i + 1),
    number: `QUOTE-2025-${String(i + 1).padStart(5, '0')}`,
    customerId: generateId('cust', (i % 20) + 1),
    customerName: customer,
    contactName: contact,
    opportunityId: i % 5 === 0 ? generateId('opp', i + 1) : undefined,
    assignedTo: fullName(),
    issueDate,
    expiryDate,
    status,
    lineItems,
    subtotal,
    discountAmount,
    tax,
    total,
    currency: 'USD',
    notes: i % 3 === 0 ? 'Customer requested itemized breakdown. Pricing valid for 30 days.' : '',
    terms: 'Net 30. 50% deposit required upon acceptance.',
    createdAt: issueDate,
  }
})

// ─── Sales Orders ─────────────────────────────────────────────────────────────

function generateOrderLineItems(count: number): OrderLineItem[] {
  const used = new Set<string>()
  const items: OrderLineItem[] = []
  for (let j = 0; j < count; j++) {
    let p = pick(PRODUCTS)
    let attempts = 0
    while (used.has(p.code) && attempts < 10) { p = pick(PRODUCTS); attempts++ }
    used.add(p.code)
    const qty = randomInt(1, 5)
    items.push({
      id: `li_${j + 1}`,
      productCode: p.code,
      description: p.description,
      quantity: qty,
      unitPrice: p.unitPrice,
      total: parseFloat((qty * p.unitPrice).toFixed(2)),
    })
  }
  return items
}

export const MOCK_SALES_ORDERS: SalesOrder[] = Array.from({ length: 45 }, (_, i) => {
  const sourceQuote = MOCK_QUOTES[i % MOCK_QUOTES.length]
  const lineItems = generateOrderLineItems(randomInt(1, 4))
  const subtotal = parseFloat(lineItems.reduce((s, li) => s + li.total, 0).toFixed(2))
  const tax = parseFloat((subtotal * 0.08).toFixed(2))
  const total = parseFloat((subtotal + tax).toFixed(2))
  const orderDate = daysAgo(randomInt(0, 120))
  const status = weightedPick([
    { value: 'pending'    as const, weight: 12 },
    { value: 'confirmed'  as const, weight: 22 },
    { value: 'processing' as const, weight: 20 },
    { value: 'shipped'    as const, weight: 18 },
    { value: 'delivered'  as const, weight: 22 },
    { value: 'cancelled'  as const, weight:  6 },
  ])
  const deliveredDate = status === 'delivered' ? daysAgo(randomInt(1, 30)) : undefined
  return {
    id: generateId('so', i + 1),
    number: `SO-2025-${String(i + 1).padStart(5, '0')}`,
    quoteId: sourceQuote.id,
    quoteNumber: sourceQuote.number,
    customerId: sourceQuote.customerId,
    customerName: sourceQuote.customerName,
    contactName: sourceQuote.contactName,
    assignedTo: fullName(),
    orderDate,
    expectedDelivery: daysFromNow(randomInt(7, 30)),
    deliveredDate,
    status,
    lineItems,
    subtotal,
    tax,
    total,
    currency: 'USD',
    notes: i % 4 === 0 ? 'Expedited delivery requested. Ship to main HQ.' : '',
    createdAt: orderDate,
  }
})

// ─── Pricing Rules ────────────────────────────────────────────────────────────

const PRICING_RULE_TEMPLATES: Array<{
  name: string
  type: PricingRule['type']
  scope: PricingRule['scope']
  scopeLabel: string
  value: number
  minQuantity?: number
}> = [
  { name: 'Q1 2025 Volume Discount',      type: 'percentage_discount', scope: 'global',         scopeLabel: 'All Products',          value: 10,   minQuantity: 5  },
  { name: 'Enterprise Customer Discount', type: 'percentage_discount', scope: 'customer_group', scopeLabel: 'Enterprise Tier',       value: 15                     },
  { name: 'Hardware Bundle Promo',        type: 'percentage_discount', scope: 'category',       scopeLabel: 'Server Hardware',       value: 8,    minQuantity: 2  },
  { name: 'Platform License Fixed Price', type: 'fixed_price',         scope: 'product',        scopeLabel: 'PROD-1010',             value: 3999                   },
  { name: 'Support Contract Discount',    type: 'percentage_discount', scope: 'category',       scopeLabel: 'Support Contracts',     value: 20                     },
  { name: 'Year-End Clearance',           type: 'fixed_discount',      scope: 'global',         scopeLabel: 'All Products',          value: 500                    },
  { name: 'New Customer Welcome',         type: 'percentage_discount', scope: 'customer_group', scopeLabel: 'New Customers',         value: 12                     },
  { name: 'Training Bundle Discount',     type: 'percentage_discount', scope: 'category',       scopeLabel: 'Training Services',     value: 10,   minQuantity: 3  },
  { name: 'Professional Services Rate',  type: 'fixed_price',         scope: 'product',        scopeLabel: 'PROD-2010',             value: 1750                   },
  { name: 'API Access Promo',             type: 'fixed_discount',      scope: 'product',        scopeLabel: 'PROD-1030',             value: 200                    },
  { name: 'Mid-Market Tier Discount',     type: 'percentage_discount', scope: 'customer_group', scopeLabel: 'Mid-Market Tier',       value: 8                      },
  { name: 'Implementation Bulk Rate',     type: 'percentage_discount', scope: 'product',        scopeLabel: 'PROD-2020',             value: 15,   minQuantity: 2  },
  { name: 'Advanced Integration Promo',   type: 'fixed_discount',      scope: 'product',        scopeLabel: 'PROD-2040',             value: 1000                   },
  { name: 'Standard Support Upgrade',     type: 'fixed_discount',      scope: 'product',        scopeLabel: 'PROD-3010',             value: 300                    },
  { name: 'Dedicated Support Promo',      type: 'percentage_discount', scope: 'product',        scopeLabel: 'PROD-3030',             value: 10                     },
  { name: 'On-site Training Bundle',      type: 'percentage_discount', scope: 'product',        scopeLabel: 'PROD-4030',             value: 12,   minQuantity: 3  },
  { name: 'High-Perf Server Discount',    type: 'percentage_discount', scope: 'product',        scopeLabel: 'PROD-5020',             value: 7                      },
  { name: 'Seasonal Services Promo',      type: 'percentage_discount', scope: 'category',       scopeLabel: 'Professional Services', value: 5                      },
  { name: 'Analytics Add-on Bundle',      type: 'fixed_discount',      scope: 'product',        scopeLabel: 'PROD-1020',             value: 150,  minQuantity: 2  },
  { name: 'SMB Starter Discount',         type: 'percentage_discount', scope: 'customer_group', scopeLabel: 'SMB Tier',              value: 5                      },
]

export const MOCK_PRICING_RULES: PricingRule[] = PRICING_RULE_TEMPLATES.map((tmpl, i) => ({
  id: generateId('pr', i + 1),
  ...tmpl,
  validFrom: daysAgo(randomInt(30, 180)),
  validTo: i % 4 === 0 ? daysFromNow(randomInt(30, 90)) : (i % 5 === 0 ? daysAgo(randomInt(1, 30)) : undefined),
  isActive: i % 5 !== 4,
  createdAt: daysAgo(randomInt(30, 200)),
}))
