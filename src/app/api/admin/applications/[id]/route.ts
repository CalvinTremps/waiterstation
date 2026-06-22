import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

async function checkAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === process.env.ADMIN_PASSWORD
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status } = await req.json()
  const valid = ['new', 'reviewed', 'shortlisted', 'rejected']
  if (!valid.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })

  const supabase = await createServerClient()
  const { error } = await supabase.from('applications').update({ status }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
