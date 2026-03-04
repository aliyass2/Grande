import { subDays, subHours, subMinutes, subMonths, addDays, format } from 'date-fns'

export function daysAgo(n: number): string {
  return subDays(new Date(), n).toISOString()
}

export function hoursAgo(n: number): string {
  return subHours(new Date(), n).toISOString()
}

export function minutesAgo(n: number): string {
  return subMinutes(new Date(), n).toISOString()
}

export function monthsAgo(n: number): string {
  return subMonths(new Date(), n).toISOString()
}

export function daysFromNow(n: number): string {
  return addDays(new Date(), n).toISOString()
}

export function isoDate(date: Date): string {
  return date.toISOString()
}

export function monthLabel(monthsBack: number): string {
  return format(subMonths(new Date(), monthsBack), 'MMM yyyy')
}
