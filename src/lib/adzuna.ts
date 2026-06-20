import { Job, RoleCategory, EmploymentType } from './types'

interface AdzunaJob {
  id: string
  title: string
  description: string
  location: { display_name: string }
  company: { display_name: string }
  salary_min?: number
  salary_max?: number
  contract_type?: string
  created: string
  redirect_url: string
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
  const fmt = (n: number) => `R${Math.round(n / 1000)}k`
  if (min && max && min !== max) return `${fmt(min)} – ${fmt(max)}/month`
  if (min) return `from ${fmt(min)}/month`
  if (max) return `up to ${fmt(max)}/month`
}

function cleanDescription(raw: string): string {
  return raw.replace(/\s{3,}/g, '\n\n').trim().slice(0, 2000)
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

  // Single broad hospitality search — fast, avoids parallel fetch timeout on Vercel
  const what = params.q || 'waiter chef bartender hospitality'

  const url = new URL('https://api.adzuna.com/v1/api/jobs/za/search/1')
  url.searchParams.set('app_id', appId)
  url.searchParams.set('app_key', appKey)
  url.searchParams.set('results_per_page', '50')
  url.searchParams.set('what', what)
  url.searchParams.set('content-type', 'application/json')
  if (params.location) url.searchParams.set('where', params.location)
  if (params.payOnly) url.searchParams.set('salary_min', '1')

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(url.toString(), {
      cache: 'no-store',
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) return null

    const data: AdzunaResponse = await res.json()
    if (!data.results?.length) return null

    const jobs: Job[] = data.results.map((j) => ({
      id: `az-${j.id}`,
      title: j.title,
      role_category: inferRoleCategory(j.title),
      location: j.location.display_name,
      employment_type: inferEmploymentType(j.contract_type),
      pay: formatPay(j.salary_min, j.salary_max),
      description: cleanDescription(j.description),
      employer_name: j.company.display_name || 'Confidential',
      contact_method: j.redirect_url,
      status: 'approved',
      created_at: j.created,
    }))

    return jobs.length > 0 ? jobs : null
  } catch {
    return null
  }
}
