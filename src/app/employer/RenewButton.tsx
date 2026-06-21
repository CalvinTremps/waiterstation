'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RenewButton({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleRenew() {
    setLoading(true)
    const res = await fetch(`/api/employer/jobs/${jobId}/renew`, { method: 'POST' })
    setLoading(false)
    if (res.ok) router.refresh()
  }

  return (
    <button
      onClick={handleRenew}
      disabled={loading}
      className="text-xs font-medium text-gray-800 border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-100 transition disabled:opacity-50"
    >
      {loading ? 'Renewing...' : 'Renew listing'}
    </button>
  )
}
