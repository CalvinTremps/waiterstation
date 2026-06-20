'use client'

import { useState } from 'react'
import { EMPLOYER_JOBS, EmployerJob } from '@/lib/mock-recruitment'

const STATUS_STYLES: Record<string, string> = {
  live: 'bg-emerald-50 text-emerald-700',
  under_review: 'bg-amber-50 text-amber-700',
  paused: 'bg-gray-100 text-gray-600',
  expired: 'bg-red-50 text-red-600',
  draft: 'bg-gray-100 text-gray-400',
}
const STATUS_LABELS: Record<string, string> = {
  live: 'Live',
  under_review: 'Under review',
  paused: 'Paused',
  expired: 'Expired',
  draft: 'Draft',
}
const EMP_LABELS: Record<string, string> = {
  permanent: 'Permanent',
  seasonal: 'Seasonal',
  event: 'Event',
}

function MiniSparkline({ values }: { values: number[] }) {
  if (!values.length) return <span className="text-xs text-gray-300">—</span>
  const max = Math.max(...values, 1)
  return (
    <div className="flex items-end gap-px h-6 w-16">
      {values.slice(-10).map((v, i) => (
        <div key={i} className="flex-1 bg-emerald-300 rounded-sm"
          style={{ height: `${Math.max(10, (v / max) * 24)}px` }} />
      ))}
    </div>
  )
}

export default function ListingsPage() {
  const [jobs, setJobs] = useState<EmployerJob[]>(EMPLOYER_JOBS)
  const [filter, setFilter] = useState<string>('all')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter)

  function togglePause(id: string) {
    setJobs(prev => prev.map(j =>
      j.id === id ? { ...j, status: j.status === 'paused' ? 'live' : 'paused' } : j
    ))
  }
  function deleteJob(id: string) {
    setJobs(prev => prev.filter(j => j.id !== id))
    setConfirmDelete(null)
  }

  const counts = {
    all: jobs.length,
    live: jobs.filter(j => j.status === 'live').length,
    under_review: jobs.filter(j => j.status === 'under_review').length,
    paused: jobs.filter(j => j.status === 'paused').length,
    expired: jobs.filter(j => j.status === 'expired').length,
    draft: jobs.filter(j => j.status === 'draft').length,
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-sm text-gray-500 mt-0.5">{jobs.length} jobs posted</p>
        </div>
        <a href="/post-job"
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Post a Job
        </a>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {(['all','live','under_review','paused','expired','draft'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
              filter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {s === 'all' ? 'All' : STATUS_LABELS[s]}
            <span className="ml-1 opacity-60">{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_80px_80px_120px_140px] gap-4 px-5 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <span>Job</span>
          <span>Type</span>
          <span>Views</span>
          <span>Applied</span>
          <span>Trend</span>
          <span>Status</span>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="font-medium">No listings found</p>
          </div>
        )}

        <div className="divide-y divide-gray-100">
          {filtered.map(job => (
            <div key={job.id} className="px-5 py-4">
              {/* Mobile layout */}
              <div className="flex items-start justify-between gap-3 md:hidden">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{job.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{job.location} · {EMP_LABELS[job.employment_type]}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                    <span>{job.views} views</span>
                    <span>{job.applicants} applied</span>
                  </div>
                </div>
                <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[job.status]}`}>
                  {STATUS_LABELS[job.status]}
                </span>
              </div>

              {/* Desktop layout */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_80px_80px_120px_140px] gap-4 items-center">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{job.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{job.location}</p>
                  {job.pay && <p className="text-xs text-emerald-600 font-medium mt-0.5">{job.pay}</p>}
                </div>
                <span className="text-sm text-gray-600">{EMP_LABELS[job.employment_type]}</span>
                <span className="text-sm font-semibold text-gray-800">{job.views}</span>
                <span className="text-sm font-semibold text-gray-800">{job.applicants}</span>
                <MiniSparkline values={job.daily_views} />
                <span className={`w-fit text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[job.status]}`}>
                  {STATUS_LABELS[job.status]}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <a href={`/employer/applicants?job=${job.id}`}
                  className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {job.applicants} applicants
                </a>
                {(job.status === 'live' || job.status === 'paused') && (
                  <button onClick={() => togglePause(job.id)}
                    className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition">
                    {job.status === 'paused' ? 'Resume' : 'Pause'}
                  </button>
                )}
                {job.status !== 'draft' && (
                  <a href={`/employer/jobs/${job.id}/edit`}
                    className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition">
                    Edit
                  </a>
                )}
                {job.status === 'draft' && (
                  <button className="text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition">
                    Publish
                  </button>
                )}
                {job.status === 'expired' && (
                  <button className="text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition">
                    Renew listing
                  </button>
                )}
                <button onClick={() => setConfirmDelete(job.id)}
                  className="text-xs font-medium text-red-500 hover:text-red-700 px-2 py-1.5 rounded-lg hover:bg-red-50 transition ml-auto">
                  Delete
                </button>
              </div>

              {/* Delete confirm */}
              {confirmDelete === job.id && (
                <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center justify-between gap-3">
                  <p className="text-xs text-red-700 font-medium">Delete this listing? This cannot be undone.</p>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setConfirmDelete(null)}
                      className="text-xs font-semibold text-gray-600 px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
                      Cancel
                    </button>
                    <button onClick={() => deleteJob(job.id)}
                      className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
