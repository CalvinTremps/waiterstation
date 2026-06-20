import { NextResponse } from 'next/server'
import { fetchAdzunaJobs } from '@/lib/adzuna'

export async function GET() {
  const appId = process.env.ADZUNA_APP_ID
  const appKey = process.env.ADZUNA_APP_KEY

  // Step 1: check env vars
  if (!appId || !appKey) {
    return NextResponse.json({ step: 'env', error: 'Missing env vars', appId: !!appId, appKey: !!appKey })
  }

  // Step 2: test raw fetch (same as debug before)
  let rawStatus: number | null = null
  let rawCount: number | null = null
  try {
    const url = new URL('https://api.adzuna.com/v1/api/jobs/za/search/1')
    url.searchParams.set('app_id', appId)
    url.searchParams.set('app_key', appKey)
    url.searchParams.set('results_per_page', '3')
    url.searchParams.set('what', 'waiter chef bartender hospitality')
    url.searchParams.set('content-type', 'application/json')
    const res = await fetch(url.toString(), { cache: 'no-store' })
    rawStatus = res.status
    const data = await res.json()
    rawCount = data.count ?? 0
  } catch (e) {
    return NextResponse.json({ step: 'raw_fetch', error: String(e) })
  }

  // Step 3: test fetchAdzunaJobs function directly
  let fnResult: number | string | null = null
  try {
    const jobs = await fetchAdzunaJobs({})
    fnResult = jobs ? jobs.length : 'returned null'
  } catch (e) {
    fnResult = `threw: ${String(e)}`
  }

  return NextResponse.json({ rawStatus, rawCount, fetchAdzunaJobsResult: fnResult })
}
