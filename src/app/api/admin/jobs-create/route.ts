import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession, ADMIN_COOKIE } from '@/lib/admin-session'
import { createServiceClient } from '@/lib/supabase-server'

async function requireAdmin() {
  const c = await cookies()
  return verifySession(c.get(ADMIN_COOKIE)?.value)
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))

  const title = String(body.title ?? '').trim()
  const employer_name = String(body.employer_name ?? '').trim()
  const location = String(body.location ?? '').trim()
  const role = String(body.role ?? '').trim()

  if (!title || !employer_name || !location || !role) {
    return NextResponse.json({ error: 'Title, employer name, location and role are required.' }, { status: 400 })
  }

  try {
    const sb = createServiceClient()
    const payload = {
      title,
      employer_name,
      location,
      role,
      employment_type: String(body.employment_type ?? 'full_time'),
      description: String(body.description ?? '').trim() || null,
      salary: String(body.salary ?? '').trim() || null,
      brand_id: body.brand_id || null,
      franchise_id: body.franchise_id || null,
      status: 'approved',
      source: 'admin',
    }
    const { error } = await sb.from('jobs').insert(payload)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
