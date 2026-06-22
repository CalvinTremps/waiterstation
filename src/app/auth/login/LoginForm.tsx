'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  if (sent) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <h2 className="font-bold text-gray-900 text-lg">Check your email</h2>
        <p className="text-gray-500 text-sm mt-2">
          We sent a magic link to <strong>{email}</strong>. Tap it to sign in.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email address</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          inputMode="email"
          autoComplete="email"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 text-white font-bold py-4 rounded-md text-base hover:bg-gray-800 transition disabled:opacity-60"
      >
        {loading ? 'Sending...' : 'Send magic link'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Used for posting jobs or managing your worker profile.
        <br />No password needed.
      </p>
    </form>
  )
}
