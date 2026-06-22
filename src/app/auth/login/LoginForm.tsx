'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'

type Role = 'worker' | 'employer'
type Step = 'role' | 'details' | 'sent'

export default function LoginForm() {
  const [step, setStep] = useState<Step>('role')
  const [role, setRole] = useState<Role>('worker')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const redirectTo =
      `${window.location.origin}/auth/callback?role=${role}&name=${encodeURIComponent(name)}`
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    })
    setLoading(false)
    if (error) setError(error.message)
    else setStep('sent')
  }

  if (step === 'sent') {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
          We sent a sign-in link to <span className="font-semibold text-gray-800">{email}</span>. Tap the link to continue — it expires in 1 hour.
        </p>
        <button
          onClick={() => { setStep('details'); setError('') }}
          className="mt-6 text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2"
        >
          Use a different email
        </button>
      </div>
    )
  }

  if (step === 'role') {
    return (
      <div className="space-y-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">I am a…</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { setRole('worker'); setStep('details') }}
            className="group relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 text-center">Job Seeker</p>
              <p className="text-xs text-gray-500 text-center mt-0.5">Find hospitality work</p>
            </div>
          </button>

          <button
            onClick={() => { setRole('employer'); setStep('details') }}
            className="group relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center transition">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 text-center">Employer</p>
              <p className="text-xs text-gray-500 text-center mt-0.5">Post jobs &amp; hire staff</p>
            </div>
          </button>
        </div>

        <div className="pt-2 text-center">
          <p className="text-xs text-gray-400">
            Already have an account?{' '}
            <button onClick={() => setStep('details')} className="text-blue-600 font-semibold hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </div>
    )
  }

  // step === 'details'
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Role badge + change */}
      <div className="flex items-center justify-between mb-1">
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
          role === 'worker' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
        }`}>
          {role === 'worker' ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
            </svg>
          )}
          {role === 'worker' ? 'Job Seeker' : 'Employer'}
        </span>
        <button type="button" onClick={() => setStep('role')} className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2">
          Change
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
          {role === 'employer' ? 'Your name' : 'Full name'}
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={role === 'employer' ? 'Jane Smith' : 'Your full name'}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          autoComplete="name"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email address</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={role === 'employer' ? 'you@restaurant.com' : 'you@example.com'}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          inputMode="email"
          autoComplete="email"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl text-sm hover:bg-gray-800 transition disabled:opacity-60 mt-2"
      >
        {loading ? 'Sending link…' : 'Continue with email'}
      </button>

      <p className="text-xs text-gray-400 text-center leading-relaxed">
        We'll email you a magic link — no password needed.
        <br />By continuing you agree to our Terms &amp; Privacy Policy.
      </p>
    </form>
  )
}
