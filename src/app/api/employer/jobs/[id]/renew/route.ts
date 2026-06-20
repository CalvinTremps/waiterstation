import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, getSession } from '@/lib/supabase-server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const supabase = await createServerClient()

  // Verify this job belongs to the session user
  const { data: job } = await supabase
    .from('jobs')
    .select('id, employer_id, status')
    .eq('id', id)
    .single()

  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (job.employer_id !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (job.status !== 'expired') return NextResponse.json({ error: 'Only expired jobs can be renewed' }, { status: 400 })

  const { error } = await supabase
    .from('jobs')
    .update({ status: 'pending', created_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Failed to renew listing' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
