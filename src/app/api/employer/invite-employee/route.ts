import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, role } = body

  if (!name || !email || !role) {
    return NextResponse.json({ error: 'name, email and role are required' }, { status: 400 })
  }

  // In production: send an actual email via Resend / SendGrid with a signup link.
  // For now we simulate a 300ms send and return success.
  await new Promise(r => setTimeout(r, 300))

  console.log(`[invite-employee] Sent invite to ${email} for role: ${role}`)

  return NextResponse.json({ success: true, message: `Invite sent to ${email}` })
}
