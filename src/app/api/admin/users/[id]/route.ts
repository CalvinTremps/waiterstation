import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

async function checkAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === process.env.ADMIN_PASSWORD
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const type = req.nextUrl.searchParams.get('type') // 'worker' | 'employer'
  const table = type === 'employer' ? 'employer_profiles' : 'worker_profiles'

  const supabase = createServiceClient()
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
