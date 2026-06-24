import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function checkAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === process.env.ADMIN_PASSWORD
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { current, next } = await req.json()

  if (current !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })
  }
  if (!next || next.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 })
  }

  // In production, update env var via your hosting provider (Vercel dashboard etc.)
  // This endpoint validates and signals success, the actual env var must be updated manually.
  return NextResponse.json({
    success: true,
    note: 'Update ADMIN_PASSWORD in your environment variables and redeploy to apply the new password.',
  })
}
