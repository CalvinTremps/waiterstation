import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession, ADMIN_COOKIE } from '@/lib/admin-session'
import { createServiceClient } from '@/lib/supabase-server'
import { hashPassword, generateTotpSecret, otpauthUrl, verifyTotp } from '@/lib/admin-auth'

async function requireAdmin() {
  const c = await cookies()
  return verifySession(c.get(ADMIN_COOKIE)?.value)
}

function dbError() {
  return NextResponse.json(
    { error: 'Storage not configured. Apply supabase/migration-admin.sql.' },
    { status: 503 }
  )
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const sb = createServiceClient()
    const { data, error } = await sb
      .from('admin_users')
      .select('id, email, name, totp_enabled, is_active, last_login_at, created_at')
      .order('created_at')
    if (error) return dbError()
    return NextResponse.json({ admins: data ?? [] })
  } catch { return dbError() }
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const action = String(body.action ?? '')

  try {
    const sb = createServiceClient()

    if (action === 'create') {
      const email = String(body.email ?? '').toLowerCase().trim()
      const password = String(body.password ?? '')
      if (!email || password.length < 8) {
        return NextResponse.json({ error: 'Email and a password of 8+ characters are required.' }, { status: 400 })
      }
      const { error } = await sb.from('admin_users').insert({
        email, name: String(body.name ?? '') || null, password_hash: hashPassword(password),
      })
      if (error) return NextResponse.json({ error: error.message.includes('duplicate') ? 'That email already exists.' : error.message }, { status: 400 })
      return NextResponse.json({ success: true })
    }

    const id = String(body.id ?? '')
    if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 })

    if (action === 'reset') {
      const password = String(body.password ?? '')
      if (password.length < 8) return NextResponse.json({ error: 'Password must be 8+ characters.' }, { status: 400 })
      await sb.from('admin_users').update({ password_hash: hashPassword(password) }).eq('id', id)
      return NextResponse.json({ success: true })
    }

    if (action === 'toggle') {
      await sb.from('admin_users').update({ is_active: body.is_active !== false }).eq('id', id)
      return NextResponse.json({ success: true })
    }

    if (action === '2fa-setup') {
      const { data } = await sb.from('admin_users').select('email').eq('id', id).single()
      const secret = generateTotpSecret()
      await sb.from('admin_users').update({ totp_secret: secret, totp_enabled: false }).eq('id', id)
      return NextResponse.json({ secret, otpauth: otpauthUrl(secret, data?.email ?? 'admin') })
    }

    if (action === '2fa-enable') {
      const { data } = await sb.from('admin_users').select('totp_secret').eq('id', id).single()
      if (!data?.totp_secret || !verifyTotp(data.totp_secret, String(body.code ?? ''))) {
        return NextResponse.json({ error: 'Invalid code. Try again.' }, { status: 400 })
      }
      await sb.from('admin_users').update({ totp_enabled: true }).eq('id', id)
      return NextResponse.json({ success: true })
    }

    if (action === '2fa-disable') {
      await sb.from('admin_users').update({ totp_enabled: false, totp_secret: null }).eq('id', id)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
  } catch { return dbError() }
}
