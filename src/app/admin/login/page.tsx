'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [mfa, setMfa] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, code }),
    })
    setLoading(false)
    if (res.ok) {
      router.push('/admin')
      return
    }
    const json = await res.json().catch(() => ({}))
    if (json.error === 'mfa_required') {
      setMfa(true)
      setError('Enter the 6-digit code from your authenticator app.')
      return
    }
    setError(json.error ?? 'Login failed.')
  }

  const field = 'w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20'

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
          <p className="text-gray-500 text-sm mb-6">Enter your admin email and password. First time? Leave email blank and use the master password.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Admin email"
              autoFocus
              autoComplete="username"
              className={field}
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete="current-password"
              className={field}
            />
            {mfa && (
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit 2FA code"
                autoComplete="one-time-code"
                className={`${field} tracking-[0.4em] text-center`}
              />
            )}
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl text-sm hover:bg-gray-100 transition disabled:opacity-50"
            >
              {loading ? 'Checking…' : mfa ? 'Verify & sign in' : 'Sign in'}
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
