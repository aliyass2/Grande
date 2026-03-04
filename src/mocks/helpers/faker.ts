// Deterministic pseudo-random seeded generator
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

const rng = seededRandom(42)

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

export function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => rng() - 0.5)
  return shuffled.slice(0, n)
}

export function weightedPick<T>(options: { value: T; weight: number }[]): T {
  const total = options.reduce((sum, o) => sum + o.weight, 0)
  const r = rng() * total
  let cumulative = 0
  for (const o of options) {
    cumulative += o.weight
    if (r <= cumulative) return o.value
  }
  return options[options.length - 1].value
}

export function randomInt(min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}

export function randomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((rng() * (max - min) + min).toFixed(decimals))
}

const FIRST_NAMES = [
  'Alexandra', 'Marcus', 'Priya', 'James', 'Sofia', 'Liam', 'Zara', 'Noah',
  'Isabella', 'Ethan', 'Olivia', 'Aiden', 'Emma', 'Lucas', 'Ava', 'Mason',
  'Mia', 'Logan', 'Charlotte', 'Oliver', 'Amelia', 'Elijah', 'Harper', 'Jacob',
  'Evelyn', 'Sebastian', 'Abigail', 'Owen', 'Emily', 'Michael', 'Elizabeth',
  'Ryan', 'Stephanie', 'Kevin', 'Jennifer', 'Brian', 'Amanda', 'David', 'Sarah',
  'Chris', 'Rachel', 'Andrew', 'Natalie', 'Jonathan', 'Lauren', 'Daniel', 'Michelle',
]

const LAST_NAMES = [
  'Chen', 'Rodriguez', 'Patel', 'Wilson', 'Anderson', 'Martinez', 'Garcia',
  'Thompson', 'Lee', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Taylor',
  'Moore', 'Jackson', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'Scott', 'King', 'Wright', 'Hill', 'Green', 'Baker', 'Adams',
  'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell',
]

const COMPANIES = [
  'Apex Solutions', 'NovaTech Industries', 'Meridian Group', 'Catalyst Corp',
  'Vertex Systems', 'Pinnacle Holdings', 'Summit Partners', 'CoreMetrics',
  'BlueSky Ventures', 'TerraLogic', 'Ironclad Technologies', 'Equinox Global',
  'Orion Dynamics', 'Stellar Innovations', 'Eclipse Consulting', 'Horizon Analytics',
  'Fortis Capital', 'Nexus Networks', 'Quantum Edge', 'Vanguard Solutions',
  'Titan Systems', 'Helios Group', 'Arcadia Partners', 'Solaris Tech',
  'Odyssey Global', 'Pantheon Corp', 'Elysian Solutions', 'Atlas Industries',
  'Phoenix Dynamics', 'Genesis Ventures',
]

export function firstName(): string {
  return pick(FIRST_NAMES)
}

export function lastName(): string {
  return pick(LAST_NAMES)
}

export function fullName(): string {
  return `${firstName()} ${lastName()}`
}

export function email(name: string, domain = 'grande-corp.com'): string {
  const parts = name.toLowerCase().split(' ')
  return `${parts[0][0]}.${parts[parts.length - 1]}@${domain}`
}

export function companyName(): string {
  return pick(COMPANIES)
}

export function generateId(prefix: string, index: number): string {
  return `${prefix}_${String(index).padStart(3, '0')}`
}
