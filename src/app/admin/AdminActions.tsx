'use client'

import { useState } from 'react'
import { JobStatus } from '@/lib/types'

export default function AdminActions({
  jobId,
  currentStatus,
}: {
  jobId: string
  currentStatus: JobStatus
}) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function updateStatus(newStatus: 'approved' | 'expired') {
    setLoading(true)
    const res = await fetch(`/api/admin/jobs/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setLoading(false)
    if (res.ok) setStatus(newStatus)
  }

  if (status === 'approved') {
    return (
      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs font-medium text-gray-900 bg-gray-100 px-2.5 py-1 rounded-full">Approved</span>
        <button
          onClick={() => updateStatus('expired')}
          disabled={loading}
          className="text-xs text-gray-400 hover:text-red-500 transition disabled:opacity-50"
        >
          Remove
        </button>
      </div>
    )
  }

  if (status === 'expired') {
    return (
      <div className="mt-3">
        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">Removed</span>
      </div>
    )
  }

  return (
    <div className="mt-3 flex gap-2">
      <button
        onClick={() => updateStatus('approved')}
        disabled={loading}
        className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={() => updateStatus('expired')}
        disabled={loading}
        className="bg-red-50 text-red-600 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-red-100 transition disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  )
}
