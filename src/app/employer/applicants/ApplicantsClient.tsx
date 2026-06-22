'use client'

import { useState, useMemo } from 'react'

type ApplicationStatus = 'new' | 'viewed' | 'shortlisted' | 'interview' | 'offered' | 'hired' | 'rejected' | 'withdrawn'

export interface RealApplication {
  id: string
  job_id: string
  job_title: string
  employer_name: string
  applicant_name: string
  applicant_phone: string
  message: string | null
  status: ApplicationStatus
  created_at: string
}

const STAGE_COLORS: Record<ApplicationStatus, string> = {
  new:         'bg-gray-100 text-gray-600',
  viewed:      'bg-blue-50 text-blue-700',
  shortlisted: 'bg-amber-50 text-amber-700',
  interview:   'bg-purple-50 text-purple-700',
  offered:     'bg-gray-100 text-gray-800',
  hired:       'bg-gray-100 text-gray-900',
  rejected:    'bg-red-50 text-red-600',
  withdrawn:   'bg-gray-100 text-gray-400',
}

const STAGE_LABELS: Record<ApplicationStatus, string> = {
  new:         'New',
  viewed:      'Viewed',
  shortlisted: 'Shortlisted',
  interview:   'Interview',
  offered:     'Offered',
  hired:       'Hired',
  rejected:    'Rejected',
  withdrawn:   'Withdrawn',
}

const ALL_STAGES: ApplicationStatus[] = ['new', 'viewed', 'shortlisted', 'interview', 'offered', 'hired', 'rejected']

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1d ago'
  return `${days}d ago`
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-gray-700', 'bg-violet-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-orange-500', 'bg-teal-500',
]

function avatarColor(name: string) {
  const i = name.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[i]
}

export default function ApplicantsClient({
  initialApplications,
  jobs,
}: {
  initialApplications: RealApplication[]
  jobs: { id: string; title: string }[]
}) {
  const [applications, setApplications] = useState<RealApplication[]>(initialApplications)
  const [stageFilter, setStageFilter] = useState<ApplicationStatus | 'all'>('all')
  const [jobId, setJobId] = useState('all')
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = [...applications]
    if (jobId !== 'all') list = list.filter(a => a.job_id === jobId)
    if (stageFilter !== 'all') list = list.filter(a => a.status === stageFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(a =>
        a.applicant_name.toLowerCase().includes(q) ||
        a.job_title.toLowerCase().includes(q)
      )
    }
    return list
  }, [applications, jobId, stageFilter, search])

  async function updateStatus(id: string, status: ApplicationStatus) {
    setUpdatingId(id)
    const res = await fetch(`/api/employer/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    }
    setUpdatingId(null)
  }

  const stageCounts = ALL_STAGES.map(s => ({
    key: s,
    label: STAGE_LABELS[s],
    count: applications.filter(a => a.status === s && (jobId === 'all' || a.job_id === jobId)).length,
  }))

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
        <p className="text-sm text-gray-500 mt-0.5">{applications.length} total application{applications.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Stage filter pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button onClick={() => setStageFilter('all')}
          className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
            stageFilter === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}>
          All ({applications.filter(a => jobId === 'all' || a.job_id === jobId).length})
        </button>
        {stageCounts.filter(s => s.count > 0 || ['new', 'shortlisted', 'interview'].includes(s.key)).map(s => (
          <button key={s.key} onClick={() => setStageFilter(s.key as ApplicationStatus)}
            className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
              stageFilter === s.key ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}>
            {s.label} ({s.count})
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or role..."
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <select value={jobId} onChange={e => setJobId(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500">
          <option value="all">All listings</option>
          {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          {applications.length === 0 ? (
            <p className="font-medium">No applications yet — they&apos;ll appear here when candidates apply.</p>
          ) : (
            <p className="font-medium">No applicants match your filters.</p>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
          {filtered.map(a => (
            <div key={a.id} className="px-5 py-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full ${avatarColor(a.applicant_name)} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {initials(a.applicant_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{a.applicant_name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.job_title}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STAGE_COLORS[a.status]}`}>
                        {STAGE_LABELS[a.status]}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">{timeAgo(a.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <a href={`tel:${a.applicant_phone}`}
                      className="text-xs font-medium text-gray-800 flex items-center gap-1 hover:underline">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                      {a.applicant_phone}
                    </a>
                  </div>

                  {a.message && (
                    <p className="text-xs text-gray-500 bg-white rounded-lg px-3 py-2 mt-2 italic line-clamp-2">
                      "{a.message}"
                    </p>
                  )}

                  {/* Move stage */}
                  <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mr-1">Move to:</span>
                    {ALL_STAGES.filter(s => s !== a.status && s !== 'withdrawn').map(s => (
                      <button key={s} onClick={() => updateStatus(a.id, s)}
                        disabled={updatingId === a.id}
                        className="text-[11px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-full transition disabled:opacity-40">
                        {STAGE_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
