'use client'

import { useState } from 'react'
import { ROLE_CATEGORIES, ROLE_LABELS, RoleCategory } from '@/lib/types'

interface WorkerProfile {
  name?: string
  role_category?: RoleCategory
  location?: string
  experience_summary?: string
  availability?: string
  phone?: string
  certifications?: string
}

export default function WorkerProfileForm({ existing }: { existing: WorkerProfile | null }) {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [role, setRole] = useState<RoleCategory | ''>(existing?.role_category ?? '')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      role_category: role || null,
      location: (form.elements.namedItem('location') as HTMLInputElement).value,
      experience_summary: (form.elements.namedItem('experience_summary') as HTMLTextAreaElement).value,
      availability: (form.elements.namedItem('availability') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      certifications: (form.elements.namedItem('certifications') as HTMLInputElement).value,
    }
    const res = await fetch('/api/worker/profile', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) setError(json.error ?? 'Something went wrong.')
    else setSaved(true)
  }

  if (saved) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <h2 className="font-bold text-gray-900 text-lg">Profile saved</h2>
        <p className="text-gray-500 text-sm mt-2">We'll use this to match you with employers in V2.</p>
        <a href="/" className="mt-5 inline-block text-sm text-emerald-700 underline">Browse jobs</a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Section label="Your name" required>
        <input name="name" required defaultValue={existing?.name ?? ''} placeholder="e.g. Thabo Nkosi" className={input} />
      </Section>

      <Section label="What do you do?" required>
        <div className="grid grid-cols-2 gap-2">
          {ROLE_CATEGORIES.map(r => (
            <button key={r} type="button" onClick={() => setRole(r === role ? '' : r)}
              className={`flex items-center gap-2.5 px-3 py-3 rounded-2xl border text-left text-sm font-medium transition
                ${role === r ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'}`}>
              <span className="leading-tight">{ROLE_LABELS[r]}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section label="Location" required hint="Where are you based or willing to work?">
        <input name="location" required defaultValue={existing?.location ?? ''} placeholder="e.g. Cape Town" className={input} />
      </Section>

      <Section label="Phone number" required hint="Employers will use this to contact you">
        <input name="phone" required type="tel" inputMode="tel" defaultValue={existing?.phone ?? ''} placeholder="+27 82 123 4567" className={input} />
      </Section>

      <Section label="Experience" hint="Brief summary of your background">
        <textarea name="experience_summary" rows={4} defaultValue={existing?.experience_summary ?? ''}
          placeholder="e.g. 3 years waitering at fine dining restaurants in Cape Town..." className={input} />
      </Section>

      <Section label="Availability" hint="When can you start / what shifts work for you?">
        <input name="availability" defaultValue={existing?.availability ?? ''} placeholder="e.g. Available immediately, evenings and weekends" className={input} />
      </Section>

      <Section label="Certifications" hint="Optional - e.g. RASA, food hygiene, wine certifications">
        <input name="certifications" defaultValue={existing?.certifications ?? ''} placeholder="e.g. RASA certificate, Food Handlers Certificate" className={input} />
      </Section>

      {error && <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-red-600 text-sm">{error}</div>}

      <button type="submit" disabled={loading}
        className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl text-base hover:bg-emerald-700 transition disabled:opacity-60">
        {loading ? 'Saving…' : existing ? 'Update profile' : 'Save profile'}
      </button>
    </form>
  )
}

function Section({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
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
