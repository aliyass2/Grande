import {
  pick, weightedPick, randomInt, randomFloat,
  firstName, lastName, companyName, email, generateId
} from '../helpers/faker'
import { daysAgo, hoursAgo, daysFromNow } from '../helpers/dates'
import type { Lead, Contact, Company, Opportunity, Activity } from '@/features/crm/types'

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Media', 'Consulting', 'Real Estate']
const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '500-1000', '1000+']
const TITLES = ['CEO', 'CTO', 'VP Sales', 'Director of Operations', 'Product Manager', 'Marketing Manager', 'Account Executive', 'Procurement Lead']
const ACTIVITY_SUBJECTS = [
  'Follow-up call', 'Product demo scheduled', 'Proposal sent', 'Contract review',
  'Onboarding discussion', 'Renewal conversation', 'Technical evaluation', 'Executive briefing',
  'Pricing discussion', 'References requested',
]
const TAGS = ['vip', 'enterprise', 'renewal', 'upsell', 'new-logo', 'at-risk', 'champion']
const DOMAINS = ['nexustech.com', 'apexcorp.com', 'meridiangroup.io', 'catalystco.com', 'vertexsys.net']

export const MOCK_COMPANIES: Company[] = Array.from({ length: 30 }, (_, i) => ({
  id: generateId('co', i + 1),
  name: companyName(),
  industry: pick(INDUSTRIES),
  size: pick(COMPANY_SIZES),
  website: `https://www.${pick(DOMAINS)}`,
  city: pick(['New York', 'San Francisco', 'Chicago', 'Austin', 'Boston', 'Seattle', 'Denver', 'Atlanta']),
  country: 'US',
  annualRevenue: randomInt(500000, 50000000),
  accountManager: `${firstName()} ${lastName()}`,
  createdAt: daysAgo(randomInt(30, 500)),
}))

export const MOCK_CONTACTS: Contact[] = Array.from({ length: 60 }, (_, i) => {
  const fn = firstName()
  const ln = lastName()
  const company = pick(MOCK_COMPANIES)
  return {
    id: generateId('con', i + 1),
    firstName: fn,
    lastName: ln,
    email: email(`${fn} ${ln}`, pick(DOMAINS)),
    phone: `+1 (${randomInt(200, 999)}) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
    title: pick(TITLES),
    companyId: company.id,
    companyName: company.name,
    linkedInUrl: `https://linkedin.com/in/${fn.toLowerCase()}-${ln.toLowerCase()}`,
    tags: Array.from(new Set([pick(TAGS), pick(TAGS)])),
    lastActivityAt: i < 10 ? hoursAgo(randomInt(1, 24)) : daysAgo(randomInt(1, 60)),
    createdAt: daysAgo(randomInt(10, 400)),
  }
})

export const MOCK_LEADS: Lead[] = Array.from({ length: 80 }, (_, i) => {
  const fn = firstName()
  const ln = lastName()
  const company = companyName()
  return {
    id: generateId('ld', i + 1),
    firstName: fn,
    lastName: ln,
    email: email(`${fn} ${ln}`, pick(DOMAINS)),
    phone: `+1 (${randomInt(200, 999)}) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
    company,
    source: weightedPick([
      { value: 'website' as const, weight: 35 },
      { value: 'referral' as const, weight: 20 },
      { value: 'linkedin' as const, weight: 15 },
      { value: 'email' as const, weight: 15 },
      { value: 'event' as const, weight: 10 },
      { value: 'cold_call' as const, weight: 5 },
    ]),
    status: weightedPick([
      { value: 'new' as const, weight: 30 },
      { value: 'contacted' as const, weight: 35 },
      { value: 'qualified' as const, weight: 25 },
      { value: 'disqualified' as const, weight: 10 },
    ]),
    assignedTo: `${firstName()} ${lastName()}`,
    notes: '',
    createdAt: daysAgo(randomInt(1, 180)),
  }
})

const STAGES: Opportunity['stage'][] = ['prospect', 'proposal', 'negotiation', 'closed_won', 'closed_lost']
const STAGE_PROBABILITIES: Record<Opportunity['stage'], number> = {
  prospect: 20,
  proposal: 40,
  negotiation: 70,
  closed_won: 100,
  closed_lost: 0,
}

export const MOCK_OPPORTUNITIES: Opportunity[] = Array.from({ length: 45 }, (_, i) => {
  const company = pick(MOCK_COMPANIES)
  const contact = pick(MOCK_CONTACTS)
  const stage = weightedPick([
    { value: 'prospect' as const, weight: 20 },
    { value: 'proposal' as const, weight: 25 },
    { value: 'negotiation' as const, weight: 20 },
    { value: 'closed_won' as const, weight: 25 },
    { value: 'closed_lost' as const, weight: 10 },
  ])

  return {
    id: generateId('opp', i + 1),
    title: `${company.name} — ${pick(['Enterprise License', 'Platform Expansion', 'Annual Renewal', 'New Implementation', 'Consulting Engagement'])}`,
    companyId: company.id,
    companyName: company.name,
    contactId: contact.id,
    contactName: `${contact.firstName} ${contact.lastName}`,
    assignedTo: `${firstName()} ${lastName()}`,
    stage,
    value: randomInt(15000, 500000),
    probability: STAGE_PROBABILITIES[stage],
    expectedCloseDate: stage === 'closed_won' || stage === 'closed_lost'
      ? daysAgo(randomInt(1, 90))
      : daysFromNow(randomInt(14, 120)),
    notes: '',
    createdAt: daysAgo(randomInt(7, 300)),
  }
})

const ACTIVITY_TYPES: Activity['type'][] = ['call', 'email', 'meeting', 'note']

export const MOCK_ACTIVITIES: Activity[] = Array.from({ length: 200 }, (_, i) => {
  const contact = pick(MOCK_CONTACTS)
  const opportunity = pick(MOCK_OPPORTUNITIES)
  const relatedToContact = i % 2 === 0

  return {
    id: generateId('act', i + 1),
    type: pick(ACTIVITY_TYPES),
    relatedTo: relatedToContact
      ? { type: 'contact', id: contact.id }
      : { type: 'opportunity', id: opportunity.id },
    subject: pick(ACTIVITY_SUBJECTS),
    body: `Activity log entry for ${relatedToContact ? contact.firstName : opportunity.title}.`,
    performedBy: `${firstName()} ${lastName()}`,
    timestamp: i < 10 ? hoursAgo(randomInt(1, 12)) : daysAgo(randomInt(1, 90)),
  }
})
