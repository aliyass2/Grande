import { apiFetch, buildQS } from '@/services/http'
import type { PaginatedResponse, ListParams } from '@/types/common'
import type {
  LedgerAccount, JournalEntry, Invoice, Bill, Expense,
  PnLRow, BalanceSheetRow,
} from '../types'

export const financeService = {
  listAccounts: () =>
    apiFetch<LedgerAccount[]>('/api/finance/accounts'),

  listJournalEntries: (params?: ListParams) =>
    apiFetch<PaginatedResponse<JournalEntry>>(`/api/finance/journal-entries${buildQS(params ?? {})}`),

  getPnL: () =>
    apiFetch<PnLRow[]>('/api/finance/pnl'),

  getBalanceSheet: () =>
    apiFetch<{ assets: BalanceSheetRow[]; liabilities: BalanceSheetRow[]; equity: BalanceSheetRow[] }>(
      '/api/finance/balance-sheet'
    ),

  listInvoices: (params?: ListParams) =>
    apiFetch<PaginatedResponse<Invoice>>(`/api/finance/invoices${buildQS(params ?? {})}`),

  getInvoice: (id: string) =>
    apiFetch<Invoice>(`/api/finance/invoices/${id}`),

  updateInvoice: (id: string, data: Partial<Invoice>) =>
    apiFetch<Invoice>(`/api/finance/invoices/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  listBills: (params?: ListParams) =>
    apiFetch<PaginatedResponse<Bill>>(`/api/finance/bills${buildQS(params ?? {})}`),

  updateBill: (id: string, data: Partial<Bill>) =>
    apiFetch<Bill>(`/api/finance/bills/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  listExpenses: (params?: ListParams) =>
    apiFetch<PaginatedResponse<Expense>>(`/api/finance/expenses${buildQS(params ?? {})}`),

  updateExpense: (id: string, data: Partial<Expense>) =>
    apiFetch<Expense>(`/api/finance/expenses/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
}
