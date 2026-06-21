'use client'

import { useState } from 'react'

export default function BrandLinkActions({ jobId }: { jobId: string }) {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [loading, setLoading] = useState(false)

  async function update(brand_link_status: 'approved' | 'rejected') {
    setLoading(true)
    const res = await fetch(`/api/admin/brand-links/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand_link_status }),
    })
    setLoading(false)
    if (res.ok) setStatus(brand_link_status)
  }

  if (status === 'approved') {
    return (
      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
          Brand link approved
        </span>
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div className="mt-3">
        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">Brand link rejected</span>
      </div>
    )
  }

  return (
    <div className="mt-3 flex gap-2">
      <button
        onClick={() => update('approved')}
        disabled={loading}
        className="bg-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
      >
        Approve brand link
      </button>
      <button
        onClick={() => update('rejected')}
        disabled={loading}
        className="bg-red-50 text-red-600 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-red-100 transition disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  )
}
