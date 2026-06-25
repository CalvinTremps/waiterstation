import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession, ADMIN_COOKIE } from '@/lib/admin-session'
import { createServiceClient } from '@/lib/supabase-server'

async function requireAdmin() {
  const c = await cookies()
  return verifySession(c.get(ADMIN_COOKIE)?.value)
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sb = createServiceClient()

  const { data: reviews, error } = await sb
    .from('brand_reviews')
    .select('*, brands(name)')
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) {
    return NextResponse.json({ error: 'brand_reviews table not found. Run migration-brands-v2.sql.' }, { status: 503 })
  }

  const counts = { pending: 0, approved: 0, rejected: 0 }
  for (const r of reviews ?? []) {
    if (r.status in counts) counts[r.status as keyof typeof counts]++
  }

  return NextResponse.json({ reviews: reviews ?? [], counts })
}
