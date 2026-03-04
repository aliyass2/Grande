export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  source: 'website' | 'referral' | 'linkedin' | 'email' | 'event' | 'cold_call'
  status: 'new' | 'contacted' | 'qualified' | 'disqualified'
  assignedTo: string
  notes: string
  createdAt: string
}

export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  title: string
  companyId: string
  companyName: string
  linkedInUrl: string
  tags: string[]
  lastActivityAt: string
  createdAt: string
}

export interface Company {
  id: string
  name: string
  industry: string
  size: string
  website: string
  city: string
  country: string
  annualRevenue: number
  accountManager: string
  createdAt: string
}

export interface Opportunity {
  id: string
  title: string
  companyId: string
  companyName: string
  contactId: string
  contactName: string
  assignedTo: string
  stage: 'prospect' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  value: number
  probability: number
  expectedCloseDate: string
  notes: string
  createdAt: string
}

export interface Activity {
  id: string
  type: 'call' | 'email' | 'meeting' | 'note'
  relatedTo: { type: 'contact' | 'opportunity'; id: string }
  subject: string
  body: string
  performedBy: string
  timestamp: string
}
