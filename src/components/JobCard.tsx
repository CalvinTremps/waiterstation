import { Job, EMPLOYMENT_TYPE_LABELS } from '@/lib/types'
import { MOCK_COMPANIES } from '@/lib/mock-companies'
import SaveButton from './SaveButton'
import CompanyBadge from './CompanyBadge'

export default function JobCard({ job }: { job: Job }) {
  const co = MOCK_COMPANIES.find(c => c.name === job.employer_name)
  const daysAgo = Math.floor((Date.now() - new Date(job.created_at).getTime()) / 86400000)
  const timeLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`
  const isNew = daysAgo === 0

  return (
    <a
      href={`/jobs/${job.id}`}
      className="flex gap-3.5 bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-px transition-all duration-150 relative group"
    >
      <CompanyBadge name={job.employer_name} size="md" logoUrl={co?.logo_url} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="font-semibold text-gray-900 text-[15px] leading-snug truncate group-hover:text-gray-800 transition-colors">
                {job.title}
              </h2>
              {isNew && (
                <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800 uppercase tracking-wide leading-none">
                  New
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 truncate mt-0.5">{job.employer_name}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {!isNew && <span className="text-xs text-gray-400">{timeLabel}</span>}
            <SaveButton jobId={job.id} />
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            {job.location}
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            {EMPLOYMENT_TYPE_LABELS[job.employment_type]}
          </span>
          {job.pay && (
            <span className="text-xs font-semibold text-gray-800">{job.pay}</span>
          )}
        </div>
      </div>
    </a>
  )
}
