import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { getAdminByEmail, verifyPassword, verifyTotp } from '@/lib/admin-auth'
import { signSession, ADMIN_COOKIE } from '@/lib/admin-session'
import { createServiceClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  if (!rateLimit(`admin-login:${ip}`, 8, 60_000)) {
    return NextResponse.json({ error: 'Too many attempts. Try again in a minute.' }, { status: 429 })
  }

  const body = await req.json().catch(() => ({}))
  const email = String(body.email ?? '').toLowerCase().trim()
  const password = String(body.password ?? '')
  const code = String(body.code ?? '').trim()

  if (!password) {
    return NextResponse.json({ error: 'Password is required.' }, { status: 400 })
  }

  // ── Break-glass: ADMIN_PASSWORD (+ optional ADMIN_BOOTSTRAP_EMAIL) ──
  // Lets you in even before any admin_users rows exist, or if the DB is down.
  const bootstrapEmail = (process.env.ADMIN_BOOTSTRAP_EMAIL ?? '').toLowerCase().trim()
  const breakGlassOk =
    !!process.env.ADMIN_PASSWORD &&
    password === process.env.ADMIN_PASSWORD &&
    (bootstrapEmail === '' || email === '' || email === bootstrapEmail)

  // ── Per-admin account ──
  if (email) {
    const admin = await getAdminByEmail(email)
    if (admin && verifyPassword(password, admin.password_hash)) {
      if (admin.totp_enabled) {
        if (!code) return NextResponse.json({ error: 'mfa_required' }, { status: 401 })
        if (!admin.totp_secret || !verifyTotp(admin.totp_secret, code)) {
          return NextResponse.json({ error: 'Invalid 2FA code.' }, { status: 401 })
        }
      }
      try {
        const sb = createServiceClient()
        await sb.from('admin_users').update({ last_login_at: new Date().toISOString() }).eq('id', admin.id)
      } catch {}
      return finish(admin.id)
    }
  }

  if (breakGlassOk) return finish('bootstrap')

  return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 })
}

async function finish(adminId: string) {
  const token = await signSession(adminId)
  const res = NextResponse.json({ success: true })
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8,
    path: '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete(ADMIN_COOKIE)
  return res
}
