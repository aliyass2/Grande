import { apiFetch, buildQS } from '@/services/http'
import type { PaginatedResponse, ListParams } from '@/types/common'
import type { Lead, Contact, Company, Opportunity, Activity } from '../types'

export const crmService = {
  listLeads: (params?: ListParams) =>
    apiFetch<PaginatedResponse<Lead>>(`/api/crm/leads${buildQS(params ?? {})}`),

  updateLead: (id: string, data: Partial<Lead>) =>
    apiFetch<Lead>(`/api/crm/leads/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  listContacts: (params?: ListParams) =>
    apiFetch<PaginatedResponse<Contact>>(`/api/crm/contacts${buildQS(params ?? {})}`),

  getContact: (id: string) => apiFetch<Contact>(`/api/crm/contacts/${id}`),

  listCompanies: (params?: ListParams) =>
    apiFetch<PaginatedResponse<Company>>(`/api/crm/companies${buildQS(params ?? {})}`),

  getCompany: (id: string) => apiFetch<Company>(`/api/crm/companies/${id}`),

  listOpportunities: (params?: ListParams) =>
    apiFetch<PaginatedResponse<Opportunity>>(`/api/crm/opportunities${buildQS(params ?? {})}`),

  getOpportunity: (id: string) => apiFetch<Opportunity>(`/api/crm/opportunities/${id}`),

  updateOpportunity: (id: string, data: Partial<Opportunity>) =>
    apiFetch<Opportunity>(`/api/crm/opportunities/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  listActivities: (params?: ListParams) =>
    apiFetch<PaginatedResponse<Activity>>(`/api/crm/activities${buildQS(params ?? {})}`),
}
