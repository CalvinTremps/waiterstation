'use client'

import { useState } from 'react'
import { Job } from '@/lib/types'

const STATUS_STYLES: Record<string, string> = {
  approved: 'bg-emerald-50 text-emerald-700',
  pending:  'bg-amber-50 text-amber-700',
  expired:  'bg-red-50 text-red-600',
}
const STATUS_LABELS: Record<string, string> = {
  approved: 'Live',
  pending:  'Under review',
  expired:  'Expired',
}
const EMP_LABELS: Record<string, string> = {
  permanent: 'Permanent',
  seasonal: 'Seasonal',
  event: 'Event',
}

export default function ListingsClient({ initialJobs }: { initialJobs: Job[] }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [filter, setFilter] = useState('all')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter)

  const counts = {
    all: jobs.length,
    approved: jobs.filter(j => j.status === 'approved').length,
    pending: jobs.filter(j => j.status === 'pending').length,
    expired: jobs.filter(j => j.status === 'expired').length,
  }

  async function deleteJob(id: string) {
    setActionLoading(id)
    const res = await fetch(`/api/employer/jobs/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setJobs(prev => prev.filter(j => j.id !== id))
      setConfirmDelete(null)
    }
    setActionLoading(null)
  }

  async function renewJob(id: string) {
    setActionLoading(id)
    const res = await fetch(`/api/employer/jobs/${id}/renew`, { method: 'POST' })
    if (res.ok) {
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'pending' as const } : j))
    }
    setActionLoading(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-sm text-gray-500 mt-0.5">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
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
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto scrollbar-none">
        {(['all', 'approved', 'pending', 'expired'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              filter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {s === 'all' ? 'All' : STATUS_LABELS[s]}
            <span className="ml-1 opacity-60">{counts[s]}</span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            {jobs.length === 0 ? (
              <div className="space-y-3">
                <p className="font-medium">No listings yet</p>
                <a href="/post-job" className="inline-block text-sm font-semibold text-emerald-700 hover:underline">
                  Post your first job →
                </a>
              </div>
            ) : (
              <p className="font-medium">No {filter} listings</p>
            )}
          </div>
        )}

        <div className="divide-y divide-gray-100">
          {filtered.map(job => (
            <div key={job.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{job.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{job.location} · {EMP_LABELS[job.employment_type] ?? job.employment_type}</p>
                  {job.pay && <p className="text-xs text-emerald-600 font-medium mt-0.5">{job.pay}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    Posted {new Date(job.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[job.status] ?? 'bg-gray-100 text-gray-500'}`}>
                  {STATUS_LABELS[job.status] ?? job.status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <a href={`/employer/applicants?job=${job.id}`}
                  className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  View applicants
                </a>
                {job.status === 'approved' && (
                  <a href={`/jobs/${job.id}`} target="_blank"
                    className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition">
                    View listing ↗
                  </a>
                )}
                {job.status === 'expired' && (
                  <button
                    onClick={() => renewJob(job.id)}
                    disabled={actionLoading === job.id}
                    className="text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition disabled:opacity-50">
                    {actionLoading === job.id ? 'Renewing…' : 'Renew listing'}
                  </button>
                )}
                <button
                  onClick={() => setConfirmDelete(job.id)}
                  className="text-xs font-medium text-red-500 hover:text-red-700 px-2 py-1.5 rounded-lg hover:bg-red-50 transition ml-auto">
                  Delete
                </button>
              </div>

              {confirmDelete === job.id && (
                <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center justify-between gap-3">
                  <p className="text-xs text-red-700 font-medium">Delete this listing? This cannot be undone.</p>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setConfirmDelete(null)}
                      className="text-xs font-semibold text-gray-600 px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
                      Cancel
                    </button>
                    <button
                      onClick={() => deleteJob(job.id)}
                      disabled={actionLoading === job.id}
                      className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition disabled:opacity-50">
                      {actionLoading === job.id ? 'Deleting…' : 'Delete'}
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
