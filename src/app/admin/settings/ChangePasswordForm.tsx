'use client'

import { useState } from 'react'

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (next !== confirm) { setError('Passwords do not match.'); return }
    if (next.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true); setError(''); setMessage('')
    const res = await fetch('/api/admin/settings/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current, next }),
    })
    setLoading(false)
    if (res.ok) {
      setMessage('Password updated. You will need to sign in again.')
      setCurrent(''); setNext(''); setConfirm('')
    } else {
      const json = await res.json()
      setError(json.error ?? 'Failed to update password.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current password</label>
        <input type="password" required value={current} onChange={e => setCurrent(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">New password</label>
        <input type="password" required value={next} onChange={e => setNext(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm new password</label>
        <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}
      <button type="submit" disabled={loading}
        className="bg-gray-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition disabled:opacity-50">
        {loading ? 'Updating…' : 'Update password'}
      </button>
    </form>
  )
}
