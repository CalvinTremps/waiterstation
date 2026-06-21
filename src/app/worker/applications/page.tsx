'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { MOCK_APPLICATIONS, ApplicationStatus, WorkerApplication } from '@/lib/mock-worker'

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  submitted: 'bg-gray-100 text-gray-600',
  viewed: 'bg-blue-50 text-blue-700',
  shortlisted: 'bg-amber-50 text-amber-700',
  interview: 'bg-purple-50 text-purple-700',
  offered: 'bg-emerald-50 text-emerald-700',
  hired: 'bg-emerald-100 text-emerald-800',
  not_selected: 'bg-red-50 text-red-600',
  withdrawn: 'bg-gray-100 text-gray-400',
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: 'Submitted',
  viewed: 'Viewed by employer',
  shortlisted: 'Shortlisted',
  interview: 'Interview booked',
  offered: 'Offer received',
  hired: 'Hired',
  not_selected: 'Not selected',
  withdrawn: 'Withdrawn',
}

const FILTER_TABS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'offered', label: 'Offers' },
  { key: 'closed', label: 'Closed' },
]

function isActive(s: ApplicationStatus) {
  return ['submitted', 'viewed', 'shortlisted', 'interview'].includes(s)
}
function isClosed(s: ApplicationStatus) {
  return ['not_selected', 'withdrawn', 'hired'].includes(s)
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })
}

const TYPE_ICON: Record<string, string> = {
  'in-person': '📍',
  phone: '📞',
  video: '💻',
}

function ApplicationCard({ app }: { app: WorkerApplication }) {
  const [withdrawn, setWithdrawn] = useState(app.status === 'withdrawn')
  const [confirmWithdraw, setConfirmWithdraw] = useState(false)

  function doWithdraw() {
    setWithdrawn(true)
    setConfirmWithdraw(false)
  }

  const status = withdrawn ? 'withdrawn' : app.status

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 leading-snug">{app.job_title}</p>
          <p className="text-sm text-gray-500 mt-0.5">{app.employer_name}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-xs text-gray-400">{app.location}</span>
            <span className="text-gray-200">·</span>
            <span className="text-xs text-gray-400 capitalize">{app.employment_type}</span>
            {app.pay && (
              <>
                <span className="text-gray-200">·</span>
                <span className="text-xs text-gray-500 font-medium">{app.pay}</span>
              </>
            )}
          </div>
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLES[status]}`}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      {app.interview_date && app.status === 'interview' && (
        <div className="bg-purple-50 border border-purple-100 rounded-lg px-3 py-2.5 flex items-center gap-2">
          <span>{TYPE_ICON[app.interview_type ?? 'in-person']}</span>
          <div>
            <p className="text-xs font-semibold text-purple-800">
              Interview: {fmtDate(app.interview_date)} at {app.interview_time}
            </p>
            <p className="text-xs text-purple-600 capitalize">{app.interview_type}</p>
          </div>
        </div>
      )}

      {app.status === 'offered' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <p className="text-xs font-semibold text-emerald-800">Offer received — check your messages to respond</p>
        </div>
      )}

      {app.notes && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 italic">{app.notes}</p>
      )}

      <div className="flex items-center justify-between pt-1">
        <div className="text-xs text-gray-400">
          Applied {fmt(app.applied_at)}
          {app.updated_at !== app.applied_at && (
            <span> · Updated {fmt(app.updated_at)}</span>
          )}
        </div>
        {!withdrawn && !isClosed(app.status) && (
          <div>
            {confirmWithdraw ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Withdraw?</span>
                <button onClick={doWithdraw}
                  className="text-xs font-semibold text-red-600 hover:underline">Yes</button>
                <button onClick={() => setConfirmWithdraw(false)}
                  className="text-xs text-gray-400 hover:underline">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmWithdraw(true)}
                className="text-xs text-gray-400 hover:text-red-500 transition font-medium">
                Withdraw
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ApplicationsInner() {
  const params = useSearchParams()
  const [filter, setFilter] = useState(params.get('filter') ?? 'all')
  const [search, setSearch] = useState('')

  const filtered = MOCK_APPLICATIONS.filter(a => {
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!a.job_title.toLowerCase().includes(q) && !a.employer_name.toLowerCase().includes(q)) return false
    }
    if (filter === 'active') return isActive(a.status)
    if (filter === 'offered') return a.status === 'offered'
    if (filter === 'closed') return isClosed(a.status)
    return true
  })

  const counts: Record<string, number> = {
    all: MOCK_APPLICATIONS.length,
    active: MOCK_APPLICATIONS.filter(a => isActive(a.status)).length,
    offered: MOCK_APPLICATIONS.filter(a => a.status === 'offered').length,
    closed: MOCK_APPLICATIONS.filter(a => isClosed(a.status)).length,
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-sm text-gray-500 mt-0.5">{MOCK_APPLICATIONS.length} total applications</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {FILTER_TABS.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              filter === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              filter === t.key ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
            }`}>{counts[t.key]}</span>
          </button>
        ))}
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search by job title or employer..."
        className="w-full max-w-sm text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="font-medium">No applications found</p>
          <p className="text-sm mt-1">Try a different filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => <ApplicationCard key={a.id} app={a} />)}
        </div>
      )}
    </div>
  )
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400 text-sm">Loading...</div>}>
      <ApplicationsInner />
    </Suspense>
  )
}
