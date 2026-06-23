import { RoleCategory, ROLE_LABELS } from './types'

/**
 * Community-contributed salary & tips data.
 * All figures are monthly, in ZAR. `tips_monthly` is self-reported average
 * monthly tips (cash + card pooled share). Anonymous by design.
 */
export interface SalarySubmission {
  id: string
  role: RoleCategory
  city: string
  base_monthly: number
  tips_monthly: number
  experience_years: number
  venue_type: string
}

export const SALARY_CITIES = [
  'Cape Town',
  'Johannesburg',
  'Durban',
  'Pretoria',
  'Stellenbosch',
] as const

// Roles that meaningfully appear in the salary explorer
export const SALARY_ROLES: RoleCategory[] = [
  'waiter', 'bartender', 'barista', 'chef', 'kitchen',
  'front_desk', 'housekeeping', 'host', 'manager',
]

export const MOCK_SALARIES: SalarySubmission[] = [
  // ── Waiters ──
  { id: 's1',  role: 'waiter', city: 'Cape Town', base_monthly: 4500, tips_monthly: 9500, experience_years: 3, venue_type: 'Fine dining' },
  { id: 's2',  role: 'waiter', city: 'Cape Town', base_monthly: 4000, tips_monthly: 11000, experience_years: 5, venue_type: 'Waterfront restaurant' },
  { id: 's3',  role: 'waiter', city: 'Cape Town', base_monthly: 3800, tips_monthly: 7200, experience_years: 1, venue_type: 'Casual dining' },
  { id: 's4',  role: 'waiter', city: 'Johannesburg', base_monthly: 4200, tips_monthly: 6000, experience_years: 4, venue_type: 'Corporate restaurant' },
  { id: 's5',  role: 'waiter', city: 'Johannesburg', base_monthly: 4000, tips_monthly: 5200, experience_years: 2, venue_type: 'Sandton bistro' },
  { id: 's6',  role: 'waiter', city: 'Durban', base_monthly: 3800, tips_monthly: 5500, experience_years: 3, venue_type: 'Beachfront restaurant' },
  { id: 's7',  role: 'waiter', city: 'Stellenbosch', base_monthly: 4200, tips_monthly: 6800, experience_years: 2, venue_type: 'Wine estate' },

  // ── Bartenders ──
  { id: 's8',  role: 'bartender', city: 'Cape Town', base_monthly: 5500, tips_monthly: 11200, experience_years: 4, venue_type: 'Cocktail bar' },
  { id: 's9',  role: 'bartender', city: 'Cape Town', base_monthly: 5000, tips_monthly: 8500, experience_years: 2, venue_type: 'Waterfront bar' },
  { id: 's10', role: 'bartender', city: 'Johannesburg', base_monthly: 5200, tips_monthly: 6500, experience_years: 3, venue_type: 'Rooftop bar' },
  { id: 's11', role: 'bartender', city: 'Durban', base_monthly: 4800, tips_monthly: 5800, experience_years: 5, venue_type: 'Hotel bar' },

  // ── Baristas ──
  { id: 's12', role: 'barista', city: 'Cape Town', base_monthly: 6000, tips_monthly: 3200, experience_years: 3, venue_type: 'Specialty coffee' },
  { id: 's13', role: 'barista', city: 'Cape Town', base_monthly: 5500, tips_monthly: 2400, experience_years: 1, venue_type: 'Café' },
  { id: 's14', role: 'barista', city: 'Johannesburg', base_monthly: 5800, tips_monthly: 2000, experience_years: 2, venue_type: 'Café' },
  { id: 's15', role: 'barista', city: 'Pretoria', base_monthly: 5200, tips_monthly: 1600, experience_years: 2, venue_type: 'Café' },

  // ── Chefs ──
  { id: 's16', role: 'chef', city: 'Cape Town', base_monthly: 14000, tips_monthly: 0, experience_years: 6, venue_type: 'Fine dining (CDP)' },
  { id: 's17', role: 'chef', city: 'Cape Town', base_monthly: 9500, tips_monthly: 0, experience_years: 3, venue_type: 'Bistro (Commis)' },
  { id: 's18', role: 'chef', city: 'Johannesburg', base_monthly: 13000, tips_monthly: 0, experience_years: 5, venue_type: 'Hotel kitchen' },
  { id: 's19', role: 'chef', city: 'Stellenbosch', base_monthly: 12500, tips_monthly: 0, experience_years: 4, venue_type: 'Wine estate restaurant' },

  // ── Kitchen staff ──
  { id: 's20', role: 'kitchen', city: 'Cape Town', base_monthly: 6000, tips_monthly: 0, experience_years: 2, venue_type: 'Casual dining' },
  { id: 's21', role: 'kitchen', city: 'Johannesburg', base_monthly: 5500, tips_monthly: 0, experience_years: 1, venue_type: 'Franchise' },
  { id: 's22', role: 'kitchen', city: 'Durban', base_monthly: 5200, tips_monthly: 0, experience_years: 3, venue_type: 'Hotel kitchen' },

  // ── Front desk ──
  { id: 's23', role: 'front_desk', city: 'Cape Town', base_monthly: 9000, tips_monthly: 0, experience_years: 3, venue_type: '5-star hotel' },
  { id: 's24', role: 'front_desk', city: 'Johannesburg', base_monthly: 8500, tips_monthly: 0, experience_years: 4, venue_type: 'Business hotel' },
  { id: 's25', role: 'front_desk', city: 'Durban', base_monthly: 7500, tips_monthly: 0, experience_years: 2, venue_type: 'Resort' },

  // ── Housekeeping ──
  { id: 's26', role: 'housekeeping', city: 'Cape Town', base_monthly: 6000, tips_monthly: 800, experience_years: 4, venue_type: 'Boutique hotel' },
  { id: 's27', role: 'housekeeping', city: 'Stellenbosch', base_monthly: 5500, tips_monthly: 1200, experience_years: 5, venue_type: 'Guest lodge' },
  { id: 's28', role: 'housekeeping', city: 'Johannesburg', base_monthly: 5200, tips_monthly: 400, experience_years: 2, venue_type: 'City hotel' },

  // ── Hosts ──
  { id: 's29', role: 'host', city: 'Cape Town', base_monthly: 5500, tips_monthly: 2200, experience_years: 2, venue_type: 'Fine dining' },
  { id: 's30', role: 'host', city: 'Johannesburg', base_monthly: 5200, tips_monthly: 1500, experience_years: 1, venue_type: 'Restaurant group' },

  // ── Managers ──
  { id: 's31', role: 'manager', city: 'Cape Town', base_monthly: 28000, tips_monthly: 0, experience_years: 6, venue_type: 'Restaurant group' },
  { id: 's32', role: 'manager', city: 'Cape Town', base_monthly: 22000, tips_monthly: 0, experience_years: 5, venue_type: 'Mid-size restaurant' },
  { id: 's33', role: 'manager', city: 'Johannesburg', base_monthly: 30000, tips_monthly: 0, experience_years: 7, venue_type: 'Hotel F&B' },
  { id: 's34', role: 'manager', city: 'Durban', base_monthly: 24000, tips_monthly: 0, experience_years: 5, venue_type: 'Resort restaurant' },
]

export interface RoleCityStat {
  role: RoleCategory
  roleLabel: string
  city: string
  count: number
  baseMedian: number
  tipsMedian: number
  totalMedian: number
  totalLow: number
  totalHigh: number
  avgExperience: number
}

function median(nums: number[]): number {
  if (nums.length === 0) return 0
  const sorted = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2)
}

/** Aggregate raw submissions into per-role, per-city statistics. */
export function aggregateSalaries(subs: SalarySubmission[]): RoleCityStat[] {
  const groups = new Map<string, SalarySubmission[]>()
  for (const s of subs) {
    const key = `${s.role}__${s.city}`
    const arr = groups.get(key) ?? []
    arr.push(s)
    groups.set(key, arr)
  }

  const stats: RoleCityStat[] = []
  for (const [key, arr] of groups) {
    const [role, city] = key.split('__') as [RoleCategory, string]
    const totals = arr.map(s => s.base_monthly + s.tips_monthly)
    stats.push({
      role,
      roleLabel: ROLE_LABELS[role],
      city,
      count: arr.length,
      baseMedian: median(arr.map(s => s.base_monthly)),
      tipsMedian: median(arr.map(s => s.tips_monthly)),
      totalMedian: median(totals),
      totalLow: Math.min(...totals),
      totalHigh: Math.max(...totals),
      avgExperience: Math.round((arr.reduce((a, s) => a + s.experience_years, 0) / arr.length) * 10) / 10,
    })
  }

  // Most-reported combinations first
  return stats.sort((a, b) => b.count - a.count || b.totalMedian - a.totalMedian)
}

export function formatRand(n: number): string {
  return 'R' + n.toLocaleString('en-ZA')
}
