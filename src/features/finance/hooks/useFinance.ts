import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { financeService } from '../services/financeService'
import type { ListParams } from '@/types/common'
import { toast } from 'sonner'

export function useLedgerAccounts() {
  return useQuery({
    queryKey: ['finance-accounts'],
    queryFn: () => financeService.listAccounts(),
  })
}

export function useJournalEntries(params?: ListParams) {
  return useQuery({
    queryKey: ['finance-journal-entries', params],
    queryFn: () => financeService.listJournalEntries(params),
  })
}

export function usePnL() {
  return useQuery({
    queryKey: ['finance-pnl'],
    queryFn: () => financeService.getPnL(),
  })
}

export function useBalanceSheet() {
  return useQuery({
    queryKey: ['finance-balance-sheet'],
    queryFn: () => financeService.getBalanceSheet(),
  })
}

export function useInvoices(params?: ListParams) {
  return useQuery({
    queryKey: ['finance-invoices', params],
    queryFn: () => financeService.listInvoices(params),
  })
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['finance-invoices', id],
    queryFn: () => financeService.getInvoice(id),
    enabled: !!id,
  })
}

export function useUpdateInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof financeService.updateInvoice>[1] }) =>
      financeService.updateInvoice(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['finance-invoices'] })
      toast.success('Invoice updated')
    },
    onError: () => toast.error('Failed to update invoice'),
  })
}

export function useBills(params?: ListParams) {
  return useQuery({
    queryKey: ['finance-bills', params],
    queryFn: () => financeService.listBills(params),
  })
}

export function useUpdateBill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof financeService.updateBill>[1] }) =>
      financeService.updateBill(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['finance-bills'] })
      toast.success('Bill updated')
    },
    onError: () => toast.error('Failed to update bill'),
  })
}

export function useExpenses(params?: ListParams) {
  return useQuery({
    queryKey: ['finance-expenses', params],
    queryFn: () => financeService.listExpenses(params),
  })
}

export function useUpdateExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof financeService.updateExpense>[1] }) =>
      financeService.updateExpense(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['finance-expenses'] })
      toast.success('Expense updated')
    },
    onError: () => toast.error('Failed to update expense'),
  })
}
