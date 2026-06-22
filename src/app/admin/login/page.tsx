'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (res.ok) {
      router.push('/admin')
    } else {
      const json = await res.json()
      setError(json.error ?? 'Login failed.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 justify-center mb-10">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
            <span className="text-gray-900 font-black text-lg">W</span>
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight">Waiterstation</p>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Admin</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          <h1 className="text-lg font-bold text-white mb-1">Sign in to admin</h1>
          <p className="text-gray-500 text-sm mb-6">Enter your admin password to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Admin password"
              autoFocus
              required
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl text-sm hover:bg-gray-100 transition disabled:opacity-50"
            >
              {loading ? 'Checking…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          <a href="/" className="hover:text-gray-400 transition">← Back to Waiterstation</a>
        </p>
      </div>
    </div>
  )
}
