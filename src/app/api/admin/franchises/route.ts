import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession, ADMIN_COOKIE } from '@/lib/admin-session'
import { createServiceClient } from '@/lib/supabase-server'

async function requireAdmin() {
  const c = await cookies()
  return verifySession(c.get(ADMIN_COOKIE)?.value)
}

function dbErr() {
  return NextResponse.json({ error: 'Database not configured. Apply supabase/migration-brands.sql.' }, { status: 503 })
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const sb = createServiceClient()
    const { data, error } = await sb
      .from('franchises')
      .select('id, brand_id, name, contact_name, contact_email, contact_phone, location, is_active, created_at, brands(name)')
      .order('name')
    if (error) return dbErr()
    return NextResponse.json({ franchises: data ?? [] })
  } catch { return dbErr() }
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const action = String(body.action ?? 'create')

  try {
    const sb = createServiceClient()

    if (action === 'create' || action === 'update') {
      const payload = {
        brand_id: body.brand_id || null,
        name: String(body.name ?? '').trim(),
        contact_name: String(body.contact_name ?? '').trim() || null,
        contact_email: String(body.contact_email ?? '').trim() || null,
        contact_phone: String(body.contact_phone ?? '').trim() || null,
        location: String(body.location ?? '').trim(),
        is_active: body.is_active !== false,
      }
      if (!payload.name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 })

      if (action === 'update') {
        const { error } = await sb.from('franchises').update(payload).eq('id', body.id)
        if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      } else {
        const { error } = await sb.from('franchises').insert(payload)
        if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      }
      return NextResponse.json({ success: true })
    }

    if (action === 'delete') {
      await sb.from('franchises').delete().eq('id', body.id)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
  } catch { return dbErr() }
}
