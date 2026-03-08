export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'

export interface LedgerAccount {
  id: string
  code: string
  name: string
  type: AccountType
  balance: number
  currency: string
}

export interface JournalEntry {
  id: string
  date: string
  reference: string
  description: string
  debitAccountId: string
  debitAccountName: string
  debitAccountCode: string
  creditAccountId: string
  creditAccountName: string
  creditAccountCode: string
  amount: number
  currency: string
  status: 'posted' | 'draft' | 'voided'
  createdBy: string
  createdAt: string
}

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  id: string
  number: string
  customerId: string
  customerName: string
  issueDate: string
  dueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'voided'
  subtotal: number
  tax: number
  total: number
  currency: string
  lineItems: InvoiceLineItem[]
  notes: string
  createdAt: string
}

export interface Bill {
  id: string
  number: string
  vendorId: string
  vendorName: string
  issueDate: string
  dueDate: string
  status: 'draft' | 'received' | 'approved' | 'paid' | 'overdue'
  subtotal: number
  tax: number
  total: number
  currency: string
  category: string
  notes: string
  createdAt: string
}

export interface Expense {
  id: string
  reference: string
  submittedBy: string
  department: string
  category: string
  merchant: string
  amount: number
  currency: string
  date: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'reimbursed'
  description: string
  createdAt: string
}

export interface PnLRow {
  label: string
  current: number
  prior: number
  isBold?: boolean
  isIndented?: boolean
  isSection?: boolean
}

export interface BalanceSheetRow {
  label: string
  amount: number
  isBold?: boolean
  isIndented?: boolean
  isSection?: boolean
}
