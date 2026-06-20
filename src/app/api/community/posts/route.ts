import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { MOCK_COMMUNITY_POSTS } from '@/lib/mock-community'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    if (!error && data) return NextResponse.json({ posts: data })
  } catch {}
  // Fall back to mock data
  return NextResponse.json({ posts: MOCK_COMMUNITY_POSTS, isMock: true })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { bowl, content, is_anonymous, author_name } = body

  if (!bowl || !content?.trim()) {
    return NextResponse.json({ error: 'bowl and content are required' }, { status: 400 })
  }
  if (content.length > 2000) {
    return NextResponse.json({ error: 'Content too long (max 2000 characters)' }, { status: 400 })
  }

  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        bowl,
        content: content.trim(),
        is_anonymous: is_anonymous ?? true,
        author_name: is_anonymous ? null : author_name,
        likes: 0,
        comments: 0,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ post: data }, { status: 201 })
  } catch {
    // Return a local mock post if DB not available
    return NextResponse.json({
      post: {
        id: `local-${Date.now()}`,
        bowl, content: content.trim(), is_anonymous: true,
        author_name: null, likes: 0, comments: 0, shares: 0,
        author_role: 'Hospitality Worker', author_avatar_letter: 'Y',
        time_ago: 'Just now', created_at: new Date().toISOString(),
      },
    }, { status: 201 })
  }
}
