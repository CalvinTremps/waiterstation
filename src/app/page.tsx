import { createServerClient, getSession } from '@/lib/supabase-server'
import { headers } from 'next/headers'
import { Job } from '@/lib/types'
import { MOCK_JOBS } from '@/lib/mock-jobs'
import { fetchAdzunaJobs } from '@/lib/adzuna'
import LandingPage from '@/components/LandingPage'

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>(resolve => setTimeout(() => resolve(null), ms)),
  ])
}

async function detectCity(ip: string): Promise<string> {
  if (!ip || ip === '127.0.0.1' || ip === '::1') return 'Cape Town'
  try {
    const res = await withTimeout(
      fetch(`https://ipapi.co/${ip}/json/`, { next: { revalidate: 3600 } }),
      2000
    )
    if (!res) return 'Cape Town'
    const data = await res.json()
    if (data.city && data.country_code === 'ZA') return data.city
    return 'Cape Town'
  } catch {
    return 'Cape Town'
  }
}

export default async function HomePage() {
  const supabase = await createServerClient()

  // Detect city from IP
  let detectedCity = 'Cape Town'
  try {
    const headersList = await headers()
    const forwarded = headersList.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : (headersList.get('x-real-ip') ?? '127.0.0.1')
    detectedCity = await detectCity(ip)
  } catch {}

  // Fetch all jobs for "near you" and role counts
  let jobs: Job[] = []
  try {
    const res = await withTimeout(
      supabase.from('jobs').select('*').eq('status', 'approved').order('created_at', { ascending: false }).limit(100),
      4000
    )
    if (res?.data && res.data.length > 0) {
      jobs = res.data
    }
  } catch {}

  // Fallback to Adzuna or mock
  if (jobs.length === 0) {
    const adzunaJobs = await fetchAdzunaJobs({})
    if (adzunaJobs && adzunaJobs.length > 0) {
      jobs = adzunaJobs
    } else {
      jobs = MOCK_JOBS
    }
  }

  let totalLive = 0
  try {
    const res = await withTimeout(
      supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      3000
    )
    totalLive = res?.count ?? 0
  } catch {}
  if (!totalLive) totalLive = jobs.length

  const nearbyJobs = jobs.filter(j =>
    j.location.toLowerCase().includes(detectedCity.toLowerCase())
  )

  const roleCounts: Record<string, number> = {}
  for (const job of jobs) {
    roleCounts[job.role_category] = (roleCounts[job.role_category] ?? 0) + 1
  }

  return (
    <LandingPage
      nearbyJobs={nearbyJobs}
      allJobs={jobs}
      detectedCity={detectedCity}
      totalLive={totalLive}
      roleCounts={roleCounts}
    />
  )
}
