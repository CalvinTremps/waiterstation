import { NextResponse } from 'next/server'

export async function GET() {
  const appId = process.env.ADZUNA_APP_ID
  const appKey = process.env.ADZUNA_APP_KEY

  if (!appId || !appKey) {
    return NextResponse.json({ error: 'Missing env vars', appId: !!appId, appKey: !!appKey })
  }

  const url = new URL('https://api.adzuna.com/v1/api/jobs/za/search/1')
  url.searchParams.set('app_id', appId)
  url.searchParams.set('app_key', appKey)
  url.searchParams.set('results_per_page', '3')
  url.searchParams.set('what', 'waiter')
  url.searchParams.set('content-type', 'application/json')

  try {
    const res = await fetch(url.toString())
    const text = await res.text()
    return NextResponse.json({ status: res.status, body: text.slice(0, 1000) })
  } catch (err) {
    return NextResponse.json({ error: String(err) })
  }
}
