'use client'

import { useState } from 'react'
import { JobStatus } from '@/lib/types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://waiterstation.co.za'

export default function EmployerJobActions({ jobId, status }: { jobId: string; status: JobStatus }) {
  const [deleted, setDeleted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Remove this listing?')) return
    setLoading(true)
    const res = await fetch(`/api/employer/jobs/${jobId}`, { method: 'DELETE' })
    setLoading(false)
    if (res.ok) setDeleted(true)
  }

  if (deleted) return <p className="text-xs text-gray-400 mt-3">Listing removed.</p>

  return (
    <div className="mt-3 flex items-center gap-3">
      <a
        href={`/employer/jobs/${jobId}/edit`}
        className="text-xs font-medium text-gray-800 hover:underline"
      >
        Edit
      </a>
      {status === 'approved' && (
        <a href={`${SITE_URL}/jobs/${jobId}`} target="_blank" className="text-xs font-medium text-gray-400 hover:text-gray-600">
          View live ↗
        </a>
      )}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="ml-auto text-xs text-red-400 hover:text-red-600 transition disabled:opacity-50"
      >
        {loading ? 'Removing…' : 'Remove'}
      </button>
    </div>
  )
}
