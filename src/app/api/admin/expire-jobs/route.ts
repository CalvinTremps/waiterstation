import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

async function checkAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  return session === process.env.ADMIN_PASSWORD
}

// Call this route periodically (e.g. via a cron job) to expire old listings.
// Jobs older than 30 days are automatically marked expired.
export async function POST() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 30)

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('jobs')
    .update({ status: 'expired' })
    .eq('status', 'approved')
    .lt('created_at', cutoff.toISOString())
    .select('id')

  if (error) return NextResponse.json({ error: 'Failed to expire jobs.' }, { status: 500 })

  return NextResponse.json({ expired: data?.length ?? 0 })
}
