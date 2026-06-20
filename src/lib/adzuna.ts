import { Job, RoleCategory, EmploymentType } from './types'

interface AdzunaJob {
  id: string
  title: string
  description: string
  location: { display_name: string; area?: string[] }
  company: { display_name: string }
  salary_min?: number
  salary_max?: number
  contract_type?: string
  created: string
  redirect_url: string
  category?: { label: string; tag: string }
}

interface AdzunaResponse {
  results: AdzunaJob[]
  count: number
}

function inferRoleCategory(title: string): RoleCategory {
  const t = title.toLowerCase()
  if (t.match(/wait(er|ress)|server|floor staff/)) return 'waiter'
  if (t.match(/chef|cook|sous|pastry|kitchen manager|culinary/)) return 'chef'
  if (t.match(/kitchen|dishwash|prep|commis/)) return 'kitchen'
  if (t.match(/barista|coffee/)) return 'barista'
  if (t.match(/bartend|bar staff|mixolog/)) return 'bartender'
  if (t.match(/housekeep|housekeeper|room attendant|cleaner|laundry/)) return 'housekeeping'
  if (t.match(/front desk|reception|concierge|check.in|porter/)) return 'front_desk'
  if (t.match(/host(ess)?|maitre|greeter/)) return 'host'
  if (t.match(/manager|supervisor|head|director|F&B/)) return 'manager'
  return 'other'
}

function inferEmploymentType(contract?: string): EmploymentType {
  if (!contract) return 'permanent'
  if (contract === 'contract' || contract === 'temporary') return 'seasonal'
  return 'permanent'
}

function formatPay(min?: number, max?: number): string | undefined {
  if (!min && !max) return undefined
  const fmt = (n: number) => `R${Math.round(n).toLocaleString('en-ZA')}`
  if (min && max && min !== max) return `${fmt(min)} – ${fmt(max)}/month`
  if (min) return `from ${fmt(min)}/month`
  if (max) return `up to ${fmt(max)}/month`
}

function cleanDescription(raw: string): string {
  return raw.replace(/\s{3,}/g, '\n\n').trim().slice(0, 2000)
}

async function fetchPage(appId: string, appKey: string, what: string, page: number, location?: string, payOnly?: boolean): Promise<AdzunaJob[]> {
  const url = new URL(`https://api.adzuna.com/v1/api/jobs/za/search/${page}`)
  url.searchParams.set('app_id', appId)
  url.searchParams.set('app_key', appKey)
  url.searchParams.set('results_per_page', '50')
  url.searchParams.set('what', what)
  url.searchParams.set('content-type', 'application/json')
  if (location) url.searchParams.set('where', location)
  if (payOnly) url.searchParams.set('salary_min', '1')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(url.toString(), { cache: 'no-store', signal: controller.signal })
    clearTimeout(timeout)
    if (!res.ok) return []
    const data: AdzunaResponse = await res.json()
    return data.results ?? []
  } catch {
    clearTimeout(timeout)
    return []
  }
}

export async function fetchAdzunaJobs(params: {
  q?: string
  location?: string
  role?: string
  type?: string
  payOnly?: boolean
}): Promise<Job[] | null> {
  const appId = process.env.ADZUNA_APP_ID
  const appKey = process.env.ADZUNA_APP_KEY
  if (!appId || !appKey) return null

  const what = params.q || 'hospitality'

  // Fetch 4 pages in parallel — up to 200 listings
  const pages = await Promise.all([1, 2, 3, 4].map(p => fetchPage(appId, appKey, what, p, params.location, params.payOnly)))
  const raw = pages.flat()

  if (!raw.length) return null

  const seen = new Set<string>()
  const jobs: Job[] = []

  for (const j of raw) {
    if (seen.has(j.id)) continue
    seen.add(j.id)
    jobs.push({
      id: `az-${j.id}`,
      title: j.title,
      role_category: inferRoleCategory(j.title),
      location: j.location.display_name,
      employment_type: inferEmploymentType(j.contract_type),
      pay: formatPay(j.salary_min, j.salary_max),
      salary_min: j.salary_min,
      salary_max: j.salary_max,
      description: cleanDescription(j.description),
      employer_name: j.company.display_name || 'Confidential',
      contact_method: j.redirect_url,
      status: 'approved',
      created_at: j.created,
      category_label: j.category?.label,
      area: j.location.area,
      source_url: j.redirect_url,
    })
  }

  return jobs.length > 0 ? jobs : null
}
