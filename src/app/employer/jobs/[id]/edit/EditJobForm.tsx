'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Job, ROLE_CATEGORIES, ROLE_LABELS, EMPLOYMENT_TYPE_LABELS, EmploymentType, RoleCategory } from '@/lib/types'

const EMPLOYMENT_TYPES: EmploymentType[] = ['permanent', 'seasonal', 'event']

export default function EditJobForm({ job }: { job: Job }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [role, setRole] = useState<RoleCategory>(job.role_category)
  const [empType, setEmpType] = useState<EmploymentType>(job.employment_type)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
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
    const res = await fetch(`/api/employer/jobs/${job.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) setError(json.error ?? 'Something went wrong.')
    else router.push('/employer')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Section label="Role">
        <div className="grid grid-cols-2 gap-2">
          {ROLE_CATEGORIES.map(r => (
            <button key={r} type="button" onClick={() => setRole(r)}
              className={`flex items-center gap-2.5 px-3 py-3 rounded-2xl border text-left text-sm font-medium transition
                ${role === r ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}>
              <span className="leading-tight">{ROLE_LABELS[r]}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section label="Job title" required>
        <input name="title" required defaultValue={job.title} className={input} />
      </Section>
      <Section label="Establishment name" required>
        <input name="employer_name" required defaultValue={job.employer_name} className={input} />
      </Section>
      <Section label="Location" required>
        <input name="location" required defaultValue={job.location} className={input} />
      </Section>

      <Section label="Employment type" required>
        <div className="flex gap-1.5 bg-gray-100 rounded-2xl p-1">
          {EMPLOYMENT_TYPES.map(t => (
            <button key={t} type="button" onClick={() => setEmpType(t)}
              className={`flex-1 text-xs font-medium py-2.5 rounded-xl transition whitespace-nowrap
                ${empType === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t === 'event' ? 'Event' : EMPLOYMENT_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </Section>

      <Section label="Pay" hint="Optional">
        <input name="pay" defaultValue={job.pay ?? ''} className={input} />
      </Section>
      <Section label="Description" required>
        <textarea name="description" required rows={6} defaultValue={job.description} className={input} />
      </Section>
      <Section label="Contact method" required>
        <input name="contact_method" required defaultValue={job.contact_method} className={input} inputMode="tel" />
      </Section>

      {error && <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-red-600 text-sm">{error}</div>}

      <div className="flex gap-3">
        <button type="button" onClick={() => router.push('/employer')}
          className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3.5 rounded-2xl text-sm hover:bg-gray-50 transition">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 bg-gray-900 text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-gray-800 transition disabled:opacity-60">
          {loading ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

function Section({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">
        {label}{required && <span className="text-gray-900 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
      {children}
    </div>
  )
}
const input = 'w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder:text-gray-400'
