import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const supabase = await createServerClient()
    await supabase.rpc('increment_likes', { post_id: id })
  } catch {}
  return NextResponse.json({ ok: true })
}
