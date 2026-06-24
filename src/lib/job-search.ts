import { createServerClient } from './supabase-server'
import { Job, RoleCategory, EmploymentType } from './types'
import { MOCK_JOBS } from './mock-jobs'
import { fetchAdzunaJobs } from './adzuna'
import { withTimeout } from './with-timeout'

export interface JobSearchParams {
  role?: string
  type?: string
  location?: string
  q?: string
  payOnly?: boolean
}

export interface JobSearchResult {
  jobs: Job[]
  totalLive: number
  isMockData: boolean
}

/**
 * Shared job search used by /jobs and the programmatic SEO landing pages.
 * Supabase first → Adzuna → mock, with timeouts so a slow backend never
 * blocks the render.
 */
export async function searchJobs(params: JobSearchParams): Promise<JobSearchResult> {
  const supabase = await createServerClient()

  let query = supabase
    .from('jobs')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (params.role) query = query.eq('role_category', params.role as RoleCategory)
  if (params.type) query = query.eq('employment_type', params.type as EmploymentType)
  if (params.location) query = query.ilike('location', `%${params.location}%`)
  if (params.q) query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`)
  if (params.payOnly) query = query.not('pay', 'is', null).neq('pay', '')

  let dbJobs: Job[] | null = null
  let dbError: unknown = null
  try {
    const res = await withTimeout(query.limit(100), 4000)
    dbJobs = res?.data ?? null
    dbError = res?.error ?? null
  } catch { dbError = true }

  let totalLive = 0
  try {
    const res = await withTimeout(
      supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      3000
    )
    totalLive = res?.count ?? 0
  } catch {}

  if (dbError || !dbJobs || dbJobs.length === 0) {
    const adzunaJobs = await fetchAdzunaJobs({
      q: params.q,
      location: params.location,
      role: params.role,
      payOnly: params.payOnly,
    })

    if (adzunaJobs) {
      let filtered = adzunaJobs
      if (params.role) filtered = filtered.filter(j => j.role_category === params.role)
      if (params.type) filtered = filtered.filter(j => j.employment_type === params.type)
      if (!totalLive) totalLive = adzunaJobs.length
      return { jobs: filtered, totalLive, isMockData: false }
    }

    let mock = MOCK_JOBS
    if (params.role) mock = mock.filter(j => j.role_category === params.role)
    if (params.type) mock = mock.filter(j => j.employment_type === params.type)
    if (params.location) mock = mock.filter(j => j.location.toLowerCase().includes(params.location!.toLowerCase()))
    if (params.q) {
      const q = params.q.toLowerCase()
      mock = mock.filter(j => j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q))
    }
    if (params.payOnly) mock = mock.filter(j => !!j.pay)
    return { jobs: mock, totalLive: totalLive || mock.length, isMockData: true }
  }

  return { jobs: dbJobs, totalLive: totalLive || dbJobs.length, isMockData: false }
}
