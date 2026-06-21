import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

const VALID_STATUSES = ['new', 'viewed', 'shortlisted', 'interview', 'offered', 'hired', 'rejected']

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { status } = await req.json()
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
  }

  const { error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', id)
    .eq('employer_id', session.user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
