import { createServerClient } from '@/lib/supabase-server'
import { Job, RoleCategory, EmploymentType } from '@/lib/types'
import { MOCK_JOBS } from '@/lib/mock-jobs'
import { fetchAdzunaJobs } from '@/lib/adzuna'
import JobBrowser from '@/components/JobBrowser'

interface SearchParams {
  role?: string
  type?: string
  location?: string
  q?: string
  payOnly?: string
}

export default async function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
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
  if (params.payOnly === '1') query = query.not('pay', 'is', null).neq('pay', '')

  const { data: dbJobs, error } = await query.limit(100)

  // Get total count of live jobs for the counter
  let totalLive = 0
  try {
    const { count } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'approved')
    totalLive = count ?? 0
  } catch {}

  let jobs: Job[]
  let isMockData = false
  if (error || !dbJobs) {
    // Try Adzuna API for real listings
    const adzunaJobs = await fetchAdzunaJobs({
      q: params.q,
      location: params.location,
      role: params.role,
      payOnly: params.payOnly === '1',
    })

    if (adzunaJobs) {
      let filtered = adzunaJobs
      if (params.role) filtered = filtered.filter(j => j.role_category === params.role)
      if (params.type) filtered = filtered.filter(j => j.employment_type === params.type)
      jobs = filtered
      if (!totalLive) totalLive = adzunaJobs.length
    } else {
      // Final fallback: curated mock data
      let mock = MOCK_JOBS
      if (params.role) mock = mock.filter(j => j.role_category === params.role)
      if (params.type) mock = mock.filter(j => j.employment_type === params.type)
      if (params.location) mock = mock.filter(j => j.location.toLowerCase().includes((params.location ?? '').toLowerCase()))
      if (params.q) {
        const q = params.q.toLowerCase()
        mock = mock.filter(j => j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q))
      }
      if (params.payOnly === '1') mock = mock.filter(j => !!j.pay)
      jobs = mock
      isMockData = true
      if (!totalLive) totalLive = mock.length
    }
  } else {
    jobs = dbJobs
    if (!totalLive) totalLive = dbJobs.length
  }

  return (
    <>
      {/* Mobile-only hero */}
      <div className="md:hidden text-white px-5 pt-10 pb-14" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%)' }}>
        <p className="text-emerald-300 text-xs font-semibold uppercase tracking-widest mb-2">South Africa's hospitality job board</p>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight">Find your next hospitality job</h1>
        <p className="text-emerald-100/90 mt-2.5 text-sm leading-relaxed">
          {totalLive > 0 && <><span className="font-bold text-white">{totalLive.toLocaleString()} open positions</span>{' '}</>}
          across South Africa. Apply in seconds — no CV required.
        </p>
      </div>

      <JobBrowser
        jobs={jobs}
        currentRole={params.role ?? ''}
        currentType={params.type ?? ''}
        currentLocation={params.location ?? ''}
        currentQuery={params.q ?? ''}
        payOnly={params.payOnly === '1'}
        isMockData={isMockData}
        totalLive={totalLive}
      />
    </>
  )
}
