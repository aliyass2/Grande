import {
  pick, weightedPick, randomInt, randomFloat, fullName, companyName, generateId,
} from '../helpers/faker'
import { daysAgo, daysFromNow, monthsAgo } from '../helpers/dates'
import type { LedgerAccount, JournalEntry, Invoice, Bill, Expense, PnLRow, BalanceSheetRow } from '@/features/finance/types'

// ─── Chart of Accounts ────────────────────────────────────────────────────────

export const MOCK_LEDGER_ACCOUNTS: LedgerAccount[] = [
  { id: 'acc_1010', code: '1010', name: 'Cash – Operating',          type: 'asset',     balance: 1240000, currency: 'USD' },
  { id: 'acc_1100', code: '1100', name: 'Accounts Receivable',       type: 'asset',     balance:  890000, currency: 'USD' },
  { id: 'acc_1200', code: '1200', name: 'Inventory',                 type: 'asset',     balance:  620000, currency: 'USD' },
  { id: 'acc_1300', code: '1300', name: 'Prepaid Expenses',          type: 'asset',     balance:   85000, currency: 'USD' },
  { id: 'acc_1500', code: '1500', name: 'Property, Plant & Equip',   type: 'asset',     balance: 1450000, currency: 'USD' },
  { id: 'acc_2010', code: '2010', name: 'Accounts Payable',          type: 'liability', balance:  420000, currency: 'USD' },
  { id: 'acc_2100', code: '2100', name: 'Accrued Liabilities',       type: 'liability', balance:  185000, currency: 'USD' },
  { id: 'acc_2500', code: '2500', name: 'Long-term Debt',            type: 'liability', balance:  900000, currency: 'USD' },
  { id: 'acc_3000', code: '3000', name: 'Common Stock',              type: 'equity',    balance:  500000, currency: 'USD' },
  { id: 'acc_3010', code: '3010', name: 'Retained Earnings',         type: 'equity',    balance: 1795000, currency: 'USD' },
  { id: 'acc_4010', code: '4010', name: 'Product Revenue',           type: 'revenue',   balance: 2840000, currency: 'USD' },
  { id: 'acc_4020', code: '4020', name: 'Service Revenue',           type: 'revenue',   balance:  680000, currency: 'USD' },
  { id: 'acc_5010', code: '5010', name: 'Cost of Goods Sold',        type: 'expense',   balance: 1420000, currency: 'USD' },
  { id: 'acc_5020', code: '5020', name: 'Payroll & Benefits',        type: 'expense',   balance:  890000, currency: 'USD' },
  { id: 'acc_5030', code: '5030', name: 'Rent & Utilities',          type: 'expense',   balance:  145000, currency: 'USD' },
  { id: 'acc_5040', code: '5040', name: 'Marketing & Advertising',   type: 'expense',   balance:  210000, currency: 'USD' },
  { id: 'acc_5050', code: '5050', name: 'General & Administrative',  type: 'expense',   balance:  185000, currency: 'USD' },
]

const JE_TEMPLATES = [
  { desc: 'Customer invoice payment received',       debit: 'acc_1010', credit: 'acc_1100' },
  { desc: 'Revenue recognized – product sale',       debit: 'acc_1100', credit: 'acc_4010' },
  { desc: 'Revenue recognized – services',           debit: 'acc_1100', credit: 'acc_4020' },
  { desc: 'Vendor invoice received',                 debit: 'acc_5010', credit: 'acc_2010' },
  { desc: 'Vendor payment disbursed',                debit: 'acc_2010', credit: 'acc_1010' },
  { desc: 'Payroll run – bi-weekly',                 debit: 'acc_5020', credit: 'acc_1010' },
  { desc: 'Rent expense accrual',                    debit: 'acc_5030', credit: 'acc_2100' },
  { desc: 'Marketing campaign spend',                debit: 'acc_5040', credit: 'acc_1010' },
  { desc: 'Prepaid insurance amortization',          debit: 'acc_5050', credit: 'acc_1300' },
  { desc: 'G&A expense accrual',                     debit: 'acc_5050', credit: 'acc_2100' },
  { desc: 'Inventory purchase',                      debit: 'acc_1200', credit: 'acc_2010' },
  { desc: 'Inventory adjustment – cycle count',      debit: 'acc_5010', credit: 'acc_1200' },
]

function accountById(id: string) {
  return MOCK_LEDGER_ACCOUNTS.find(a => a.id === id)!
}

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = Array.from({ length: 200 }, (_, i) => {
  const tmpl = pick(JE_TEMPLATES)
  const debitAcc = accountById(tmpl.debit)
  const creditAcc = accountById(tmpl.credit)
  return {
    id: generateId('je', i + 1),
    date: i < 30 ? daysAgo(randomInt(0, 7)) : daysAgo(randomInt(8, 365)),
    reference: `JE-2025-${String(i + 1).padStart(5, '0')}`,
    description: tmpl.desc,
    debitAccountId: debitAcc.id,
    debitAccountName: debitAcc.name,
    debitAccountCode: debitAcc.code,
    creditAccountId: creditAcc.id,
    creditAccountName: creditAcc.name,
    creditAccountCode: creditAcc.code,
    amount: randomInt(1200, 185000),
    currency: 'USD',
    status: weightedPick([
      { value: 'posted' as const, weight: 80 },
      { value: 'draft'  as const, weight: 15 },
      { value: 'voided' as const, weight:  5 },
    ]),
    createdBy: fullName(),
    createdAt: daysAgo(randomInt(0, 365)),
  }
})

// ─── Invoices ─────────────────────────────────────────────────────────────────

const LINE_ITEM_DESCS = [
  'Software License – Annual',
  'Platform Access Fee – Q1',
  'Professional Services – Implementation',
  'Consulting Engagement – March',
  'Support & Maintenance Contract',
  'Training Services – Remote',
  'Data Integration Module',
  'Custom Development – Phase 1',
  'API Access – Enterprise Tier',
  'Managed Services – Monthly',
]

function generateLineItems(count: number) {
  return Array.from({ length: count }, (_, j) => {
    const qty = randomInt(1, 10)
    const unit = randomFloat(800, 12000, 2)
    return {
      id: `li_${j + 1}`,
      description: pick(LINE_ITEM_DESCS),
      quantity: qty,
      unitPrice: unit,
      total: parseFloat((qty * unit).toFixed(2)),
    }
  })
}

const CUSTOMER_NAMES = [
  'Apex Solutions', 'NovaTech Industries', 'Meridian Group', 'Catalyst Corp',
  'Vertex Systems', 'Pinnacle Holdings', 'BlueSky Ventures', 'TerraLogic',
  'Ironclad Technologies', 'Equinox Global', 'Orion Dynamics', 'Horizon Analytics',
  'Fortis Capital', 'Nexus Networks', 'Quantum Edge', 'Vanguard Solutions',
]

export const MOCK_INVOICES: Invoice[] = Array.from({ length: 65 }, (_, i) => {
  const issueDate = i < 20 ? daysAgo(randomInt(0, 14)) : daysAgo(randomInt(15, 180))
  const dueDays = randomInt(15, 45)
  const dueDate = i % 8 === 0 ? daysAgo(randomInt(1, 30)) : daysFromNow(dueDays)
  const lineItems = generateLineItems(randomInt(1, 4))
  const subtotal = parseFloat(lineItems.reduce((s, li) => s + li.total, 0).toFixed(2))
  const tax = parseFloat((subtotal * 0.08).toFixed(2))

  const isOverdue = new Date(dueDate) < new Date() && i % 8 === 0
  const status = weightedPick([
    { value: 'paid'    as const, weight: 40 },
    { value: 'sent'    as const, weight: 25 },
    { value: 'draft'   as const, weight: 15 },
    { value: 'overdue' as const, weight: 15 },
    { value: 'voided'  as const, weight:  5 },
  ])

  return {
    id: generateId('inv', i + 1),
    number: `INV-2025-${String(i + 1).padStart(5, '0')}`,
    customerId: `cust_${(i % 16) + 1}`,
    customerName: CUSTOMER_NAMES[i % CUSTOMER_NAMES.length],
    issueDate,
    dueDate: isOverdue ? dueDate : dueDate,
    status: isOverdue ? 'overdue' : status,
    subtotal,
    tax,
    total: parseFloat((subtotal + tax).toFixed(2)),
    currency: 'USD',
    lineItems,
    notes: i % 5 === 0 ? 'Net-30 payment terms. Please reference invoice number on payment.' : '',
    createdAt: issueDate,
  }
})

// ─── Bills ────────────────────────────────────────────────────────────────────

const VENDORS = [
  'AWS Cloud Services', 'Salesforce Inc', 'Oracle Corp', 'Adobe Systems',
  'Microsoft Corp', 'Slack Technologies', 'Zoom Video Comms', 'Stripe Inc',
  'Cloudflare Inc', 'Twilio Inc', 'Atlassian Corp', 'HubSpot Inc',
]

const BILL_CATEGORIES = [
  'Software & SaaS', 'Cloud Infrastructure', 'Professional Services',
  'Office & Facilities', 'Marketing', 'Hardware', 'Utilities', 'Insurance',
]

export const MOCK_BILLS: Bill[] = Array.from({ length: 45 }, (_, i) => {
  const issueDate = i < 15 ? daysAgo(randomInt(0, 10)) : daysAgo(randomInt(11, 120))
  const dueDays = randomInt(14, 30)
  const dueDate = i % 7 === 0 ? daysAgo(randomInt(1, 20)) : daysFromNow(dueDays)
  const isOverdue = i % 7 === 0
  const subtotal = randomInt(800, 48000)
  const tax = parseFloat((subtotal * 0.08).toFixed(2))

  return {
    id: generateId('bill', i + 1),
    number: `BILL-2025-${String(i + 1).padStart(5, '0')}`,
    vendorId: `vendor_${(i % 12) + 1}`,
    vendorName: VENDORS[i % VENDORS.length],
    issueDate,
    dueDate,
    status: isOverdue
      ? 'overdue'
      : weightedPick([
          { value: 'paid'     as const, weight: 35 },
          { value: 'approved' as const, weight: 30 },
          { value: 'received' as const, weight: 20 },
          { value: 'draft'    as const, weight: 15 },
        ]),
    subtotal,
    tax,
    total: subtotal + tax,
    currency: 'USD',
    category: pick(BILL_CATEGORIES),
    notes: '',
    createdAt: issueDate,
  }
})

// ─── Expenses ─────────────────────────────────────────────────────────────────

const EXPENSE_CATEGORIES = [
  'Travel & Accommodation', 'Meals & Entertainment', 'Office Supplies',
  'Software Tools', 'Training & Education', 'Client Gifts', 'Subscriptions', 'Transport',
]

const MERCHANTS = [
  'Delta Airlines', 'Marriott Hotels', 'Uber Business', 'Amazon Business',
  'Staples', 'Udemy for Business', 'Expensify', 'Lyft', 'Best Buy',
  'The Capital Grille', 'Hilton Hotels', 'American Airlines', 'Apple Store',
  'Conference HQ', 'FedEx', 'Office Depot',
]

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations', 'HR', 'Legal']

export const MOCK_EXPENSES: Expense[] = Array.from({ length: 110 }, (_, i) => {
  const date = i < 25 ? daysAgo(randomInt(0, 7)) : daysAgo(randomInt(8, 90))
  return {
    id: generateId('exp', i + 1),
    reference: `EXP-2025-${String(i + 1).padStart(5, '0')}`,
    submittedBy: fullName(),
    department: pick(DEPARTMENTS),
    category: pick(EXPENSE_CATEGORIES),
    merchant: pick(MERCHANTS),
    amount: randomFloat(18, 4800, 2),
    currency: 'USD',
    date,
    status: weightedPick([
      { value: 'reimbursed' as const, weight: 30 },
      { value: 'approved'   as const, weight: 25 },
      { value: 'submitted'  as const, weight: 25 },
      { value: 'rejected'   as const, weight: 10 },
      { value: 'draft'      as const, weight: 10 },
    ]),
    description: `${pick(EXPENSE_CATEGORIES)} – business purpose`,
    createdAt: date,
  }
})

// ─── P&L (Income Statement) ────────────────────────────────────────────────────

export const MOCK_PNL_ROWS: PnLRow[] = [
  { label: 'Revenue',                      current:        0, prior:        0, isSection: true },
  { label: 'Product Sales',                current: 2840000, prior: 2490000, isIndented: true },
  { label: 'Service Revenue',              current:  680000, prior:  660000, isIndented: true },
  { label: 'Total Revenue',                current: 3520000, prior: 3150000, isBold: true },
  { label: 'Cost of Revenue',              current:        0, prior:        0, isSection: true },
  { label: 'Cost of Goods Sold',           current: 1420000, prior: 1295000, isIndented: true },
  { label: 'Gross Profit',                 current: 2100000, prior: 1855000, isBold: true },
  { label: 'Operating Expenses',           current:        0, prior:        0, isSection: true },
  { label: 'Payroll & Benefits',           current:  890000, prior:  820000, isIndented: true },
  { label: 'Rent & Utilities',             current:  145000, prior:  138000, isIndented: true },
  { label: 'Marketing & Advertising',      current:  210000, prior:  175000, isIndented: true },
  { label: 'General & Administrative',     current:  185000, prior:  162000, isIndented: true },
  { label: 'Total Operating Expenses',     current: 1430000, prior: 1295000, isBold: true },
  { label: 'Operating Income (EBIT)',       current:  670000, prior:  560000, isBold: true },
  { label: 'Other',                         current:        0, prior:        0, isSection: true },
  { label: 'Interest Income',              current:   12000, prior:    9500, isIndented: true },
  { label: 'Interest Expense',             current:  -38000, prior:  -42000, isIndented: true },
  { label: 'Net Income',                   current:  644000, prior:  527500, isBold: true },
]

// ─── Balance Sheet ─────────────────────────────────────────────────────────────

export const MOCK_BALANCE_SHEET: { assets: BalanceSheetRow[]; liabilities: BalanceSheetRow[]; equity: BalanceSheetRow[] } = {
  assets: [
    { label: 'Current Assets',                isSection: true,  amount: 0 },
    { label: 'Cash & Equivalents',            isIndented: true, amount: 1240000 },
    { label: 'Accounts Receivable',           isIndented: true, amount:  890000 },
    { label: 'Inventory',                     isIndented: true, amount:  620000 },
    { label: 'Prepaid Expenses',              isIndented: true, amount:   85000 },
    { label: 'Total Current Assets',          isBold: true,     amount: 2835000 },
    { label: 'Non-Current Assets',            isSection: true,  amount: 0 },
    { label: 'Property, Plant & Equipment',   isIndented: true, amount: 1450000 },
    { label: 'Accumulated Depreciation',      isIndented: true, amount: -380000 },
    { label: 'Intangible Assets',             isIndented: true, amount:  240000 },
    { label: 'Total Non-Current Assets',      isBold: true,     amount: 1310000 },
    { label: 'Total Assets',                  isBold: true,     amount: 4145000 },
  ],
  liabilities: [
    { label: 'Current Liabilities',           isSection: true,  amount: 0 },
    { label: 'Accounts Payable',              isIndented: true, amount:  420000 },
    { label: 'Accrued Liabilities',           isIndented: true, amount:  185000 },
    { label: 'Short-term Debt',               isIndented: true, amount:  250000 },
    { label: 'Total Current Liabilities',     isBold: true,     amount:  855000 },
    { label: 'Non-Current Liabilities',       isSection: true,  amount: 0 },
    { label: 'Long-term Debt',                isIndented: true, amount:  900000 },
    { label: 'Deferred Tax Liability',        isIndented: true, amount:   95000 },
    { label: 'Total Non-Current Liabilities', isBold: true,     amount:  995000 },
    { label: 'Total Liabilities',             isBold: true,     amount: 1850000 },
  ],
  equity: [
    { label: 'Shareholders\' Equity',         isSection: true,  amount: 0 },
    { label: 'Common Stock',                  isIndented: true, amount:  500000 },
    { label: 'Additional Paid-in Capital',    isIndented: true, amount:  644000 },
    { label: 'Retained Earnings',             isIndented: true, amount: 1151000 },
    { label: 'Total Equity',                  isBold: true,     amount: 2295000 },
    { label: 'Total Liabilities & Equity',    isBold: true,     amount: 4145000 },
  ],
}
