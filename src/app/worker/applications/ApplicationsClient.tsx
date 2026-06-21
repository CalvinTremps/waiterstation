'use client'

import { useState, useMemo } from 'react'

type AppStatus = 'new' | 'viewed' | 'shortlisted' | 'interview' | 'offered' | 'hired' | 'rejected' | 'withdrawn'

export interface RealWorkerApplication {
  id: string
  job_id: string
  job_title: string
  employer_name: string
  applicant_phone: string
  message: string | null
  status: AppStatus
  created_at: string
}

const STATUS_STYLES: Record<AppStatus, string> = {
  new:         'bg-gray-100 text-gray-600',
  viewed:      'bg-blue-50 text-blue-700',
  shortlisted: 'bg-amber-50 text-amber-700',
  interview:   'bg-purple-50 text-purple-700',
  offered:     'bg-gray-100 text-gray-800',
  hired:       'bg-gray-100 text-gray-900',
  rejected:    'bg-red-50 text-red-600',
  withdrawn:   'bg-gray-100 text-gray-400',
}

const STATUS_LABELS: Record<AppStatus, string> = {
  new:         'Submitted',
  viewed:      'Viewed by employer',
  shortlisted: 'Shortlisted',
  interview:   'Interview booked',
  offered:     'Offer received',
  hired:       'Hired',
  rejected:    'Not selected',
  withdrawn:   'Withdrawn',
}

function isActive(s: AppStatus) {
  return ['new', 'viewed', 'shortlisted', 'interview'].includes(s)
}
function isClosed(s: AppStatus) {
  return ['rejected', 'withdrawn', 'hired'].includes(s)
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

function ApplicationCard({ app, onWithdraw }: { app: RealWorkerApplication; onWithdraw: (id: string) => void }) {
  const [confirmWithdraw, setConfirmWithdraw] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)

  async function doWithdraw() {
    setWithdrawing(true)
    const res = await fetch(`/api/worker/applications/${app.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'withdrawn' }),
    })
    if (res.ok) onWithdraw(app.id)
    setWithdrawing(false)
    setConfirmWithdraw(false)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 leading-snug">{app.job_title}</p>
          <p className="text-sm text-gray-500 mt-0.5">{app.employer_name}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLES[app.status]}`}>
          {STATUS_LABELS[app.status]}
        </span>
      </div>

      {app.status === 'offered' && (
        <div className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2.5">
          <p className="text-xs font-semibold text-gray-900">Offer received — the employer will contact you directly.</p>
        </div>
      )}

      {app.message && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 italic">{app.message}</p>
      )}

      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-gray-400">Applied {fmt(app.created_at)}</p>
        {!isClosed(app.status) && isActive(app.status) && (
          confirmWithdraw ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Withdraw?</span>
              <button onClick={doWithdraw} disabled={withdrawing}
                className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50">
                {withdrawing ? 'Withdrawing…' : 'Yes'}
              </button>
              <button onClick={() => setConfirmWithdraw(false)} className="text-xs text-gray-400 hover:underline">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setConfirmWithdraw(true)}
              className="text-xs text-gray-400 hover:text-red-500 transition font-medium">
              Withdraw
            </button>
          )
        )}
        {isActive(app.status) && (
          <a href={`/jobs/${app.job_id}`} className="text-xs text-gray-800 font-medium hover:underline">
            View job →
          </a>
        )}
      </div>
    </div>
  )
}

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'offered', label: 'Offers' },
  { key: 'closed', label: 'Closed' },
]

export default function ApplicationsClient({ initialApplications }: { initialApplications: RealWorkerApplication[] }) {
  const [applications, setApplications] = useState(initialApplications)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  function handleWithdraw(id: string) {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'withdrawn' as AppStatus } : a))
  }

  const filtered = useMemo(() => {
    let list = [...applications]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(a =>
        a.job_title.toLowerCase().includes(q) || a.employer_name.toLowerCase().includes(q)
      )
    }
    if (filter === 'active') list = list.filter(a => isActive(a.status))
    if (filter === 'offered') list = list.filter(a => a.status === 'offered')
    if (filter === 'closed') list = list.filter(a => isClosed(a.status))
    return list
  }, [applications, filter, search])

  const counts = {
    all: applications.length,
    active: applications.filter(a => isActive(a.status)).length,
    offered: applications.filter(a => a.status === 'offered').length,
    closed: applications.filter(a => isClosed(a.status)).length,
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-sm text-gray-500 mt-0.5">{applications.length} total application{applications.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {FILTER_TABS.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              filter === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              filter === t.key ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
            }`}>{counts[t.key as keyof typeof counts]}</span>
          </button>
        ))}
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search by job or employer..."
        className="w-full max-w-sm text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500" />

      {applications.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="font-medium">No applications yet</p>
          <p className="text-sm mt-1">
            <a href="/" className="text-gray-900 font-semibold hover:underline">Browse jobs</a> and apply in seconds.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="font-medium">No applications match your filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => (
            <ApplicationCard key={a.id} app={a} onWithdraw={handleWithdraw} />
          ))}
        </div>
      )}
    </div>
  )
}
