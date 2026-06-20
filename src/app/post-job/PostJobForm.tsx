'use client'

import { useState } from 'react'
import { ROLE_CATEGORIES, ROLE_LABELS, EMPLOYMENT_TYPE_LABELS, EmploymentType, RoleCategory } from '@/lib/types'

const EMPLOYMENT_TYPES: EmploymentType[] = ['permanent', 'seasonal', 'event']

export default function PostJobForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [role, setRole] = useState<RoleCategory | ''>('')
  const [empType, setEmpType] = useState<EmploymentType | ''>('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!role) { setError('Please select a role category.'); return }
    if (!empType) { setError('Please select an employment type.'); return }
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const data = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      role_category: role,
      location: (form.elements.namedItem('location') as HTMLInputElement).value,
      employment_type: empType,
      pay: (form.elements.namedItem('pay') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      employer_name: (form.elements.namedItem('employer_name') as HTMLInputElement).value,
      contact_method: (form.elements.namedItem('contact_method') as HTMLInputElement).value,
    }

    const res = await fetch('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) setError(json.error ?? 'Something went wrong. Please try again.')
    else setSuccess(true)
  }

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-bold text-gray-900 text-xl">Listing submitted!</h2>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed max-w-xs mx-auto">
          Your job will go live once we've reviewed it — usually within a few hours during business hours.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <a
            href="/employer"
            className="inline-block bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-emerald-700 transition"
          >
            View my listings
          </a>
          <a
            href="/post-job"
            className="inline-block border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-gray-50 transition"
          >
            Post another job
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Role category — icon grid */}
      <Section label="What role are you hiring for?" required>
        <div className="grid grid-cols-2 gap-2">
          {ROLE_CATEGORIES.map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r === role ? '' : r)}
              className={`flex items-center gap-2.5 px-3 py-3 rounded-2xl border text-left text-sm font-medium transition
                ${role === r
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'
                }`}
            >
              <span className="leading-tight">{ROLE_LABELS[r]}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section label="Job title" required>
        <input
          name="title"
          required
          placeholder="e.g. Experienced Waiter, Head Chef"
          className={input}
        />
      </Section>

      <Section label="Establishment name" required>
        <input
          name="employer_name"
          required
          placeholder="e.g. The Grand Hotel, Café Bello"
          className={input}
        />
      </Section>

      <Section label="Location" required>
        <input
          name="location"
          required
          placeholder="e.g. Cape Town, Sandton, Durban North"
          className={input}
        />
      </Section>

      {/* Employment type — segmented */}
      <Section label="Employment type" required>
        <div className="flex gap-1.5 bg-gray-100 rounded-2xl p-1">
          {EMPLOYMENT_TYPES.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setEmpType(t === empType ? '' : t)}
              className={`flex-1 text-sm font-medium py-2.5 rounded-xl transition
                ${empType === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {EMPLOYMENT_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </Section>

      <Section label="Pay" hint="Optional - e.g. R6 000/month, R120/hour + tips">
        <input name="pay" placeholder="e.g. R6 000/month" className={input} />
      </Section>

      <Section label="Job description" required>
        <textarea
          name="description"
          required
          rows={5}
          placeholder="Describe the role, hours, what you're looking for in a candidate..."
          className={input}
        />
      </Section>

      <Section label="Your contact number or email" required hint="Applicants who apply on Waiterstation will be given this to reach you (e.g. +27 82 123 4567 or hello@venue.co.za)">
        <input
          name="contact_method"
          required
          placeholder="+27 82 123 4567"
          className={input}
          inputMode="tel"
        />
      </Section>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl text-base hover:bg-emerald-700 active:bg-emerald-800 transition disabled:opacity-60"
      >
        {loading ? 'Submitting…' : 'Submit listing'}
      </button>

      <p className="text-xs text-gray-400 text-center pb-4">
        Free during beta · Reviewed before going live
      </p>
    </form>
  )
}

function Section({ label, hint, required, children }: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">
        {label}{required && <span className="text-emerald-600 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
      {children}
    </div>
  )
}

const input = 'w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-gray-400'
