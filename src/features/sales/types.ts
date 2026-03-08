export interface QuoteLineItem {
  id: string
  productCode: string
  description: string
  quantity: number
  unitPrice: number
  discount: number   // percentage 0–100
  total: number      // after discount applied
}

export interface Quote {
  id: string
  number: string
  customerId: string
  customerName: string
  contactName: string
  opportunityId?: string
  assignedTo: string
  issueDate: string
  expiryDate: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted'
  lineItems: QuoteLineItem[]
  subtotal: number
  discountAmount: number
  tax: number
  total: number
  currency: string
  notes: string
  terms: string
  createdAt: string
}

export interface OrderLineItem {
  id: string
  productCode: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface SalesOrder {
  id: string
  number: string
  quoteId: string
  quoteNumber: string
  customerId: string
  customerName: string
  contactName: string
  assignedTo: string
  orderDate: string
  expectedDelivery: string
  deliveredDate?: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  lineItems: OrderLineItem[]
  subtotal: number
  tax: number
  total: number
  currency: string
  notes: string
  createdAt: string
}

export interface PricingRule {
  id: string
  name: string
  type: 'percentage_discount' | 'fixed_discount' | 'fixed_price'
  scope: 'global' | 'customer_group' | 'product' | 'category'
  scopeLabel: string
  value: number
  minQuantity?: number
  validFrom: string
  validTo?: string
  isActive: boolean
  createdAt: string
}
