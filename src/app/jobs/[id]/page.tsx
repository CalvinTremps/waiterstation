import { createServerClient } from '@/lib/supabase-server'
import { ROLE_LABELS, EMPLOYMENT_TYPE_LABELS } from '@/lib/types'
import { MOCK_JOBS } from '@/lib/mock-jobs'
import { fetchAdzunaJobs } from '@/lib/adzuna'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import BackButton from './BackButton'
import SaveButton from '@/components/SaveButton'
import ShareButton from '@/components/ShareButton'
import ApplyButton from './ApplyButton'
import RelatedJobs from '@/components/RelatedJobs'
import CompanyBadge from '@/components/CompanyBadge'

async function getJob(id: string) {
  try {
    const supabase = await createServerClient()
    const { data } = await supabase.from('jobs').select('*').eq('id', id).eq('status', 'approved').single()
    if (data) return data
  } catch {}
  // Check mock jobs
  const mock = MOCK_JOBS.find(j => j.id === id)
  if (mock) return mock
  // Check Adzuna (id starts with 'az-')
  if (id.startsWith('az-')) {
    const adzunaJobs = await fetchAdzunaJobs({})
    return adzunaJobs?.find(j => j.id === id) ?? null
  }
  return null
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const job = await getJob(id)
  if (!job) return { title: 'Job Not Found' }
  return {
    title: `${job.title} in ${job.location} | Waiterstation`,
    description: `${job.title} at ${job.employer_name} in ${job.location}. Apply in seconds on Waiterstation — no CV required.`,
  }
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await getJob(id)

  if (!job) notFound()

  const postedDate = new Date(job.created_at).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <>
      <div className="max-w-xl mx-auto px-4 pt-5 pb-32">
        <div className="flex items-center justify-between mb-5">
          <BackButton />
          <div className="flex items-center gap-2">
            <ShareButton title={`${job.title} at ${job.employer_name}`} url={`https://waiterstation.co.za/jobs/${job.id}`} />
            <SaveButton jobId={job.id} size="lg" />
          </div>
        </div>

        {/* Header card */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex gap-4 items-start">
            <CompanyBadge name={job.employer_name} size="lg" />
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h1>
              <p className="text-gray-500 text-sm mt-0.5">{job.employer_name}</p>
              <div className="flex flex-wrap gap-2 mt-2.5">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {job.location}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  {EMPLOYMENT_TYPE_LABELS[job.employment_type as keyof typeof EMPLOYMENT_TYPE_LABELS]}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  {ROLE_LABELS[job.role_category as keyof typeof ROLE_LABELS]}
                </span>
              </div>
            </div>
          </div>

          {job.pay && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Pay</p>
              <p className="text-gray-800 font-semibold mt-0.5">{job.pay}</p>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mt-3">
          <h2 className="font-semibold text-gray-900 mb-3">About this role</h2>
          <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">{job.description}</p>
        </div>

        <p className="text-xs text-gray-400 text-center mt-5">Posted {postedDate}</p>
        <RelatedJobs roleCategory={job.role_category} excludeId={job.id} />
      </div>

      {/* Sticky apply CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 pb-safe z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-xl mx-auto">
          <ApplyButton job={job} />
        </div>
      </div>
    </>
  )
}
