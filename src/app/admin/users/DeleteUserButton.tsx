'use client'

import { useState } from 'react'

export default function DeleteUserButton({
  userId, type, name,
}: { userId: string; type: 'worker' | 'employer'; name: string }) {
  const [loading, setLoading] = useState(false)
  const [deleted, setDeleted] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return
    setLoading(true)
    const res = await fetch(`/api/admin/users/${userId}?type=${type}`, { method: 'DELETE' })
    setLoading(false)
    if (res.ok) setDeleted(true)
  }

  if (deleted) return <span className="text-xs text-gray-400">Deleted</span>

  return (
    <button onClick={handleDelete} disabled={loading}
      className="text-xs text-red-500 hover:text-red-700 font-medium transition disabled:opacity-50">
      {loading ? 'Deleting…' : 'Delete'}
    </button>
  )
}
