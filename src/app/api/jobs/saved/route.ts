import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { MOCK_JOBS } from '@/lib/mock-jobs'

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('ids') ?? ''
  const ids = raw.split(',').map(s => s.trim()).filter(Boolean).slice(0, 50)

  if (ids.length === 0) return NextResponse.json({ jobs: [] })

  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .in('id', ids)
      .eq('status', 'approved')

    if (!error && data) return NextResponse.json({ jobs: data })
  } catch {}

  // Fall back to mock data for IDs that match
  const mockMatches = MOCK_JOBS.filter(j => ids.includes(j.id))
  return NextResponse.json({ jobs: mockMatches })
}
