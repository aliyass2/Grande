import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { crmService } from '../services/crmService'
import type { ListParams } from '@/types/common'
import { toast } from 'sonner'

export function useLeads(params?: ListParams) {
  return useQuery({ queryKey: ['crm-leads', params], queryFn: () => crmService.listLeads(params) })
}

export function useContacts(params?: ListParams) {
  return useQuery({ queryKey: ['crm-contacts', params], queryFn: () => crmService.listContacts(params) })
}

export function useContact(id: string) {
  return useQuery({
    queryKey: ['crm-contacts', id],
    queryFn: () => crmService.getContact(id),
    enabled: !!id,
  })
}

export function useCompanies(params?: ListParams) {
  return useQuery({ queryKey: ['crm-companies', params], queryFn: () => crmService.listCompanies(params) })
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: ['crm-companies', id],
    queryFn: () => crmService.getCompany(id),
    enabled: !!id,
  })
}

export function useOpportunities(params?: ListParams) {
  return useQuery({ queryKey: ['crm-opportunities', params], queryFn: () => crmService.listOpportunities(params) })
}

export function useOpportunity(id: string) {
  return useQuery({
    queryKey: ['crm-opportunities', id],
    queryFn: () => crmService.getOpportunity(id),
    enabled: !!id,
  })
}

export function useActivities(params?: ListParams) {
  return useQuery({ queryKey: ['crm-activities', params], queryFn: () => crmService.listActivities(params) })
}

export function useUpdateOpportunity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof crmService.updateOpportunity>[1] }) =>
      crmService.updateOpportunity(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crm-opportunities'] })
      toast.success('Opportunity updated')
    },
    onError: () => toast.error('Failed to update opportunity'),
  })
}

export function useUpdateLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof crmService.updateLead>[1] }) =>
      crmService.updateLead(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crm-leads'] })
      toast.success('Lead updated')
    },
    onError: () => toast.error('Failed to update lead'),
  })
}
