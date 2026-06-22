import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { MOCK_COMPANIES } from '@/lib/mock-companies'
import { createServerClient } from '@/lib/supabase-server'
import { Job } from '@/lib/types'
import CompanyClient from './CompanyClient'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return MOCK_COMPANIES.map(c => ({ id: c.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const company = MOCK_COMPANIES.find(c => c.id === id)
  if (!company) return { title: 'Company not found' }
  return {
    title: `${company.name} Reviews & Salaries | Waiterstation`,
    description: `Read employee reviews, salary info, and benefits at ${company.name}. ${company.description.slice(0, 120)}...`,
  }
}

export default async function CompanyPage({ params }: Props) {
  const { id } = await params
  const company = MOCK_COMPANIES.find(c => c.id === id)
  if (!company) notFound()

  // Fetch jobs belonging to this company: direct employer name matches + approved franchise jobs
  let franchiseJobs: Job[] = []
  try {
    const supabase = await createServerClient()
    const [{ data: directJobs }, { data: linkedJobs }] = await Promise.all([
      supabase
        .from('jobs')
        .select('*')
        .ilike('employer_name', `%${company!.name}%`)
        .eq('status', 'approved')
        .order('created_at', { ascending: false }),
      supabase
        .from('jobs')
        .select('*')
        .eq('parent_company_id', id)
        .eq('brand_link_status', 'approved')
        .eq('status', 'approved')
        .order('created_at', { ascending: false }),
    ])
    // Merge, dedupe by id
    const seen = new Set<string>()
    for (const j of [...(directJobs ?? []), ...(linkedJobs ?? [])]) {
      if (!seen.has(j.id)) { seen.add(j.id); franchiseJobs.push(j) }
    }
  } catch {}

  return (
    <Suspense>
      <CompanyClient company={company} franchiseJobs={franchiseJobs} />
    </Suspense>
  )
}
