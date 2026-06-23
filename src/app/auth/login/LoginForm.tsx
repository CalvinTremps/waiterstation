'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'

type Step = 'start' | 'email' | 'sent'

export default function LoginForm() {
  const [step, setStep] = useState<Step>('start')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?role=worker`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
    if (error) { setError(error.message); setGoogleLoading(false) }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?role=worker&name=${encodeURIComponent(name)}`,
      },
    })
    setLoading(false)
    if (error) setError(error.message)
    else setStep('sent')
  }

  if (step === 'sent') {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Check your inbox</h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
          We sent a sign-in link to <span className="font-semibold text-gray-800">{email}</span>. Tap it to continue — expires in 1 hour.
        </p>
        <button onClick={() => { setStep('start'); setError('') }}
          className="mt-5 text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2">
          Use a different method
        </button>
      </div>
    )
  }

  if (step === 'start') {
    return (
      <div className="space-y-3">
        {/* Google */}
        <button onClick={handleGoogleSignIn} disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-semibold text-sm py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition disabled:opacity-60 shadow-sm">
          {googleLoading ? (
            <svg className="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-medium">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <button onClick={() => setStep('email')}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold text-sm py-3 rounded-xl hover:bg-violet-700 transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Continue with email
        </button>

        <p className="text-xs text-gray-400 text-center leading-relaxed pt-1">
          By continuing you agree to our Terms &amp; Privacy Policy.
        </p>
      </div>
    )
  }

  // step === 'email'
  return (
    <form onSubmit={handleEmailSubmit} className="space-y-4">
      <button type="button" onClick={() => { setStep('start'); setError('') }}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 mb-2">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Your name</label>
        <input type="text" required value={name} onChange={e => setName(e.target.value)}
          placeholder="Full name"
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          autoComplete="name" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email address</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          inputMode="email" autoComplete="email" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-sm">{error}</div>
      )}

      <button type="submit" disabled={loading}
        className="w-full bg-violet-600 text-white font-bold py-3.5 rounded-xl text-sm hover:bg-violet-700 transition disabled:opacity-60">
        {loading ? 'Sending link…' : 'Send magic link'}
      </button>

      <p className="text-xs text-gray-400 text-center">No password needed — we'll email you a sign-in link.</p>
    </form>
  )
}
