'use client'

import { useState } from 'react'

export default function ApplicationStatusButton({
  appId, currentStatus,
}: { appId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function update(newStatus: string) {
    setLoading(true)
    const res = await fetch(`/api/admin/applications/${appId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setLoading(false)
    if (res.ok) setStatus(newStatus)
  }

  return (
    <select
      value={status}
      onChange={e => update(e.target.value)}
      disabled={loading}
      className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 cursor-pointer"
    >
      <option value="new">New</option>
      <option value="reviewed">Reviewed</option>
      <option value="shortlisted">Shortlisted</option>
      <option value="rejected">Rejected</option>
    </select>
  )
}
