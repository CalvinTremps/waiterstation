import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession, ADMIN_COOKIE } from '@/lib/admin-session'
import { createServiceClient } from '@/lib/supabase-server'

async function requireAdmin() {
  const c = await cookies()
  return verifySession(c.get(ADMIN_COOKIE)?.value)
}

function dbErr(msg = 'Database not configured. Apply supabase/migration-brands.sql.') {
  return NextResponse.json({ error: msg }, { status: 503 })
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const sb = createServiceClient()
    const { data, error } = await sb
      .from('brands')
      .select('id, name, industry, size, location, description, website, logo_url, is_active, created_at')
      .order('name')
    if (error) return dbErr()
    return NextResponse.json({ brands: data ?? [] })
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
        name: String(body.name ?? '').trim(),
        industry: String(body.industry ?? '').trim(),
        size: String(body.size ?? '').trim(),
        location: String(body.location ?? '').trim(),
        description: String(body.description ?? '').trim(),
        website: String(body.website ?? '').trim() || null,
        logo_url: String(body.logo_url ?? '').trim() || null,
        is_active: body.is_active !== false,
      }
      if (!payload.name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 })

      if (action === 'update') {
        const { error } = await sb.from('brands').update(payload).eq('id', body.id)
        if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      } else {
        const { error } = await sb.from('brands').insert(payload)
        if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      }
      return NextResponse.json({ success: true })
    }

    if (action === 'delete') {
      await sb.from('brands').delete().eq('id', body.id)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
  } catch { return dbErr() }
}
