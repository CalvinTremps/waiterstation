import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, getSession } from '@/lib/supabase-server'
import { ROLE_CATEGORIES, RoleCategory, EmploymentType } from '@/lib/types'

const EMPLOYMENT_TYPES: EmploymentType[] = ['permanent', 'seasonal', 'event']

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { title, role_category, location, employment_type, pay, description, employer_name, contact_method } = body

  if (!title || !role_category || !location || !employment_type || !description || !employer_name || !contact_method) {
    return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 400 })
  }
  if (!ROLE_CATEGORIES.includes(role_category as RoleCategory)) {
    return NextResponse.json({ error: 'Invalid role category.' }, { status: 400 })
  }
  if (!EMPLOYMENT_TYPES.includes(employment_type as EmploymentType)) {
    return NextResponse.json({ error: 'Invalid employment type.' }, { status: 400 })
  }

  const supabase = await createServerClient()
  const { error } = await supabase
    .from('jobs')
    .update({ title, role_category, location, employment_type, pay: pay || null, description, employer_name, contact_method, status: 'pending' })
    .eq('id', id)
    .eq('employer_id', session.user.id)

  if (error) return NextResponse.json({ error: 'Failed to update listing. Please try again.' }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('jobs')
    .update({ status: 'expired' })
    .eq('id', id)
    .eq('employer_id', session.user.id)

  if (error) return NextResponse.json({ error: 'Failed to remove listing. Please try again.' }, { status: 500 })
  return NextResponse.json({ success: true })
}
