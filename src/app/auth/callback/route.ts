import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const role = searchParams.get('role') ?? 'worker'
  const name = searchParams.get('name') ?? ''

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
  }

  const supabase = await createServerClient()
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
  }

  if (role === 'employer') {
    // Check if employer profile exists; create if not
    const { data: existing } = await supabase
      .from('employer_profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existing) {
      await supabase.from('employer_profiles').insert({
        id: user.id,
        contact_name: name || (user.email?.split('@')[0] ?? ''),
      })
    }
    return NextResponse.redirect(`${origin}/employer`)
  } else {
    // Check if worker profile exists; create if not
    const { data: existing } = await supabase
      .from('worker_profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existing) {
      await supabase.from('worker_profiles').insert({
        id: user.id,
        name: name || (user.email?.split('@')[0] ?? ''),
      })
    }
    return NextResponse.redirect(`${origin}/worker`)
  }
}
