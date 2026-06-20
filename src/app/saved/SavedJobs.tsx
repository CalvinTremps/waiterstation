'use client'

import { useState, useEffect } from 'react'
import { getSavedIds } from '@/components/SaveButton'
import { Job } from '@/lib/types'
import JobCard from '@/components/JobCard'

export default function SavedJobs() {
  const [jobs, setJobs] = useState<Job[] | null>(null)

  useEffect(() => {
    const ids = getSavedIds()
    if (ids.length === 0) { setJobs([]); return }

    fetch(`/api/jobs/saved?ids=${ids.join(',')}`)
      .then(r => r.json())
      .then(data => setJobs(data.jobs ?? []))
      .catch(() => setJobs([]))
  }, [])

  if (jobs === null) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-white border border-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-semibold text-gray-700 mb-1">No saved jobs yet</p>
        <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
          Tap the bookmark icon on any job to save it for later.
        </p>
        <a
          href="/"
          className="inline-block bg-emerald-600 text-white font-semibold px-6 py-3 rounded-md text-sm hover:bg-emerald-700 transition"
        >
          Browse jobs
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
        {jobs.length} saved job{jobs.length !== 1 ? 's' : ''}
      </p>
      {jobs.map(job => <JobCard key={job.id} job={job} />)}
    </div>
  )
}
