import { createServerClient } from '@/lib/supabase-server'
import { ROLE_LABELS, EMPLOYMENT_TYPE_LABELS } from '@/lib/types'
import { MOCK_JOBS } from '@/lib/mock-jobs'
import { MOCK_COMPANIES } from '@/lib/mock-companies'
import { fetchAdzunaJobs } from '@/lib/adzuna'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import BackButton from './BackButton'
import SaveButton from '@/components/SaveButton'
import ShareButton from '@/components/ShareButton'
import ApplyButton from './ApplyButton'
import RelatedJobs from '@/components/RelatedJobs'
import CompanyBadge from '@/components/CompanyBadge'
import ClaimedBadge from '@/components/ClaimedBadge'
import { Icon } from '@/components/Icon'

async function getJob(id: string) {
  try {
    const supabase = await createServerClient()
    const { data } = await supabase.from('jobs').select('*').eq('id', id).eq('status', 'approved').single()
    if (data) return data
  } catch {}
  const mock = MOCK_JOBS.find(j => j.id === id)
  if (mock) return mock
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

const EMP_COLORS: Record<string, string> = {
  permanent: 'bg-gray-100 text-gray-700',
  seasonal:  'bg-blue-50 text-blue-700',
  event:     'bg-purple-50 text-purple-700',
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  )
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24 sm:w-32 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gray-800 rounded-full" style={{ width: `${(value / 5) * 100}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-6 text-right">{value.toFixed(1)}</span>
    </div>
  )
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await getJob(id)

  if (!job) notFound()

  const co = MOCK_COMPANIES.find(c => c.name === job.employer_name)
  const postedDate = new Date(job.created_at).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <>
      <div className="max-w-xl mx-auto px-4 pt-5 pb-32">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <BackButton />
          <div className="flex items-center gap-2">
            <ShareButton title={`${job.title} at ${job.employer_name}`} url={`https://waiterstation.co.za/jobs/${job.id}`} />
            <SaveButton jobId={job.id} size="lg" />
          </div>
        </div>

        {/* ── Header ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-start gap-4">
            <CompanyBadge name={job.employer_name} size="lg" logoUrl={co?.logo_url} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <p className="text-xs font-semibold text-gray-400">{job.employer_name}</p>
                <ClaimedBadge claimed={co?.claimed} />
              </div>
              <h1 className="text-xl font-extrabold text-gray-900 leading-tight">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">{job.location}</span>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${EMP_COLORS[job.employment_type] ?? 'bg-gray-100 text-gray-600'}`}>
                  {job.employment_type === 'event' ? 'Event / Once-off' : EMPLOYMENT_TYPE_LABELS[job.employment_type as keyof typeof EMPLOYMENT_TYPE_LABELS]}
                </span>
                {co && (
                  <div className="flex items-center gap-1">
                    <Stars rating={co.overall_rating} />
                    <span className="text-xs font-bold text-gray-700">{co.overall_rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({co.reviews.length})</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {job.pay && (
            <div className="mt-4 bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pay</p>
                <p className="text-base font-extrabold text-gray-900">{job.pay}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Job description ── */}
        <section className="mt-4 bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-3">Job description</h2>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          <p className="text-xs text-gray-400 mt-4">Posted {postedDate}</p>
          {job.source_url && (
            <a href={job.source_url} target="_blank" rel="noopener noreferrer"
              className="inline-block mt-2 text-xs font-semibold text-gray-500 hover:text-gray-800 hover:underline">
              View original listing ↗
            </a>
          )}
        </section>

        {/* ── Company overview ── */}
        <section className="mt-4 bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-3">Company overview</h2>
          <div className="flex flex-wrap gap-x-5 gap-y-3 mb-4">
            {[
              { icon: 'building', label: 'Size', value: co?.size ?? 'Not listed' },
              { icon: 'location', label: 'Location', value: job.location },
              { icon: 'tag', label: 'Industry', value: co?.industry ?? job.category_label ?? 'Hospitality' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <Icon name={s.icon} className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide leading-none">{s.label}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
          {co ? (
            <>
              <p className="text-sm text-gray-600 leading-relaxed">{co.description}</p>
              <a href={`/companies/${co.id}`}
                className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-gray-900 hover:underline">
                View full company profile →
              </a>
            </>
          ) : (
            <p className="text-sm text-gray-400 italic">No company profile yet on Waiterstation.</p>
          )}
        </section>

        {/* ── Ratings ── */}
        <section className="mt-4 bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">{job.employer_name} ratings</h2>
          {co ? (
            <div className="flex items-start gap-4">
              <div className="text-center shrink-0">
                <p className="text-3xl font-extrabold text-gray-900 leading-none">{co.overall_rating.toFixed(1)}</p>
                <Stars rating={co.overall_rating} />
                <p className="text-xs text-gray-400 mt-1">{co.reviews.length} reviews</p>
              </div>
              <div className="flex-1 space-y-2.5">
                <RatingBar label="Work-life balance" value={co.ratings.work_life_balance} />
                <RatingBar label="Culture & values" value={co.ratings.culture} />
                <RatingBar label="Management" value={co.ratings.management} />
                <RatingBar label="Career growth" value={co.ratings.career_growth} />
                <RatingBar label="Compensation" value={co.ratings.compensation} />
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm font-semibold text-gray-700 mb-1">No ratings yet</p>
              <p className="text-xs text-gray-400">Be the first to rate {job.employer_name} on Waiterstation.</p>
            </div>
          )}
        </section>

        {/* ── Benefits ── */}
        <section className="mt-4 bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-3">{job.employer_name} benefits</h2>
          {co ? (
            <div className="flex flex-wrap gap-2">
              {co.benefits.map(b => (
                <span key={b} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                  <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  {b}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Benefits not listed by this employer.</p>
          )}
        </section>

        {/* ── Employee reviews ── */}
        <section className="mt-4 bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Employee reviews</h2>
          {co ? (
            <>
              <div className="space-y-3">
                {co.reviews.map(r => (
                  <div key={r.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{r.anonymous ? 'Anonymous' : r.author_name}</p>
                        <p className="text-xs text-gray-500">{r.role} · {r.employment_status} · {r.date}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Stars rating={r.rating} />
                        {r.salary && <span className="text-[10px] text-gray-400 ml-1">{r.salary}</span>}
                      </div>
                    </div>
                    <div className="space-y-1.5 text-sm text-gray-700">
                      <p><span className="font-semibold text-gray-900">Pros: </span>{r.pros}</p>
                      <p><span className="font-semibold text-gray-900">Cons: </span>{r.cons}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">{r.helpful_count} people found this helpful</p>
                  </div>
                ))}
              </div>
              <a href={`/companies/${co.id}`}
                className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-gray-900 hover:underline">
                See all reviews for {co.name} →
              </a>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm font-semibold text-gray-700 mb-1">No reviews yet</p>
              <p className="text-xs text-gray-400 mb-3">Know what it&apos;s like to work at {job.employer_name}? Share your experience.</p>
              <a href="/community" className="text-xs font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
                Write a review
              </a>
            </div>
          )}
        </section>

        <RelatedJobs roleCategory={job.role_category} excludeId={job.id} />
      </div>

      {/* Sticky apply bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pt-3 z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <div className="max-w-xl mx-auto">
          <ApplyButton job={job} />
        </div>
      </div>
    </>
  )
}
