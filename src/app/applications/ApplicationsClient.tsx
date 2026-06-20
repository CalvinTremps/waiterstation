'use client'
import { useState, useEffect } from 'react'

interface AppliedJob {
  jobId: string
  jobTitle: string
  employerName: string
  location: string
  appliedAt: string
}

const STORAGE_KEY = 'waiterstation_applied_jobs'

export function trackApplication(job: { id: string; title: string; employer_name: string; location: string }) {
  if (typeof window === 'undefined') return
  const existing: AppliedJob[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  if (existing.some(a => a.jobId === job.id)) return
  existing.unshift({ jobId: job.id, jobTitle: job.title, employerName: job.employer_name, location: job.location, appliedAt: new Date().toISOString() })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 100)))
}

export default function ApplicationsClient() {
  const [applications, setApplications] = useState<AppliedJob[] | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setApplications(stored ? JSON.parse(stored) : [])
  }, [])

  if (applications === null) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white border border-gray-200 rounded-lg animate-pulse" />)}
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-semibold text-gray-700 mb-1">No applications yet</p>
        <p className="text-sm text-gray-400 mb-6">Jobs you apply to on Waiterstation will appear here.</p>
        <a href="/" className="inline-block bg-emerald-600 text-white font-semibold px-6 py-3 rounded-md text-sm hover:bg-emerald-700 transition">
          Browse jobs
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
        {applications.length} application{applications.length !== 1 ? 's' : ''}
      </p>
      {applications.map(app => {
        const daysAgo = Math.floor((Date.now() - new Date(app.appliedAt).getTime()) / 86400000)
        const when = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`
        return (
          <a
            key={app.jobId}
            href={`/jobs/${app.jobId}`}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition group"
          >
            <div className="w-10 h-10 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-sm font-semibold text-gray-500 shrink-0">
              {app.employerName.trim().charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-emerald-700 transition">{app.jobTitle}</p>
              <p className="text-xs text-gray-500">{app.employerName} · {app.location}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Applied</span>
              <p className="text-xs text-gray-400 mt-0.5">{when}</p>
            </div>
          </a>
        )
      })}
      <button
        onClick={() => { localStorage.removeItem(STORAGE_KEY); setApplications([]) }}
        className="text-xs text-gray-400 hover:text-red-500 transition mt-2"
      >
        Clear history
      </button>
    </div>
  )
}
