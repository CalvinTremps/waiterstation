'use client'

import { useEffect, useState } from 'react'

const INDUSTRIES = ['Restaurant Group', 'Restaurant Chain', 'Fine Dining Restaurant', 'Hotel Group', 'Luxury Hotel', 'Boutique Hotel', 'International Hotel Group', 'Hotel & Casino Group', 'Fast Food', 'Café / Restaurant', 'Bar / Nightclub', 'Catering', 'Hospitality Group', 'Cruise Line', 'Safari & Lodge', 'Wine Estate', 'Steakhouse', 'Other']
const SIZE_OPTIONS = ['1–10 employees', '11–50 employees', '51–200 employees', '201–500 employees', '500–1 000 employees', '1 000+ employees']

const input = 'w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder:text-gray-400'

interface EmployerProfile {
  company_name: string | null
  company_description: string | null
  company_logo_url: string | null
  company_location: string | null
  company_website: string | null
  company_industry: string | null
  company_size: string | null
  brand_id: string | null
}

interface Brand {
  id: string
  name: string
  industry: string
  size: string
  location: string
  description: string
  website: string | null
  logo_url: string | null
  overall_rating: number | null
  ratings: Record<string, number> | null
  claimed: boolean
}

const RATING_LABELS: [string, string][] = [
  ['work_life_balance', 'Work-life balance'],
  ['culture', 'Culture & values'],
  ['management', 'Management'],
  ['career_growth', 'Career growth'],
  ['compensation', 'Pay & compensation'],
]

export default function EmployerProfilePage() {
  const [loading, setLoading] = useState(true)
  const [employer, setEmployer] = useState<EmployerProfile | null>(null)
  const [brand, setBrand] = useState<Brand | null>(null)
  const [form, setForm] = useState<Partial<EmployerProfile>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    fetch('/api/employer/brand-profile')
      .then(r => r.json())
      .then(json => {
        const e: EmployerProfile = json.employer ?? {}
        setEmployer(e)
        setBrand(json.brand ?? null)
        setForm({
          company_name: e.company_name ?? brand?.name ?? '',
          company_description: e.company_description ?? '',
          company_logo_url: e.company_logo_url ?? '',
          company_location: e.company_location ?? '',
          company_website: e.company_website ?? '',
          company_industry: e.company_industry ?? '',
          company_size: e.company_size ?? '',
        })
      })
      .catch(() => setErr('Failed to load profile.'))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function save() {
    setSaving(true); setErr(''); setSaved(false)
    const res = await fetch('/api/employer/brand-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const json = await res.json().catch(() => ({}))
    setSaving(false)
    if (!res.ok) { setErr(json.error ?? 'Save failed.'); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const displayName = form.company_name || brand?.name || 'Your Company'
  const overallRating = brand?.overall_rating

  if (loading) return <div className="p-6 text-sm text-gray-400">Loading...</div>

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Visible to all job seekers on Waiterstation.</p>
        </div>
        {brand && (
          <a href={`/companies/${brand.id}`} target="_blank" rel="noopener noreferrer"
            className="shrink-0 text-xs text-gray-700 font-semibold border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-lg flex items-center gap-1">
            View public page ↗
          </a>
        )}
      </div>

      {err && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">{err}</div>}

      {/* What you can edit */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div>
          <h2 className="font-semibold text-gray-900">Basic information</h2>
          <p className="text-xs text-gray-400 mt-0.5">This information appears on your public company profile.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Company name</label>
          <input className={input} value={form.company_name ?? ''} onChange={e => setForm({ ...form, company_name: e.target.value })} placeholder="e.g. One&Only Cape Town" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Industry</label>
            <select className={input} value={form.company_industry ?? ''} onChange={e => setForm({ ...form, company_industry: e.target.value })}>
              <option value="">Select...</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Company size</label>
            <select className={input} value={form.company_size ?? ''} onChange={e => setForm({ ...form, company_size: e.target.value })}>
              <option value="">Select...</option>
              {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
          <input className={input} value={form.company_location ?? ''} onChange={e => setForm({ ...form, company_location: e.target.value })} placeholder="e.g. V&A Waterfront, Cape Town" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
          <input className={input} value={form.company_website ?? ''} onChange={e => setForm({ ...form, company_website: e.target.value })} placeholder="e.g. yourrestaurant.co.za" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Logo URL</label>
          <input className={input} value={form.company_logo_url ?? ''} onChange={e => setForm({ ...form, company_logo_url: e.target.value })} placeholder="https://..." />
          {form.company_logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.company_logo_url} alt="Logo preview" className="mt-2 w-14 h-14 rounded-xl object-contain border border-gray-200 bg-white" />
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">About your company</label>
          <p className="text-xs text-gray-400 mb-1.5">Tell job seekers what makes your venue special. Shown on your public profile.</p>
          <textarea className={`${input} resize-none h-28`} value={form.company_description ?? ''} onChange={e => setForm({ ...form, company_description: e.target.value })} placeholder="Describe your venue, culture, and what employees can expect..." />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button onClick={save} disabled={saving}
            className="bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          {saved && (
            <span className="text-sm text-green-700 font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              Saved
            </span>
          )}
        </div>
      </div>

      {/* Ratings — read-only, crowdsourced */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Ratings</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Ratings are crowdsourced from employee reviews and <strong>cannot be edited</strong> by employers.
              They update automatically as new verified reviews come in.
            </p>
          </div>
          <span className="shrink-0 text-[10px] font-bold bg-gray-200 text-gray-500 px-2.5 py-1 rounded-full uppercase tracking-wide">Read-only</span>
        </div>

        {overallRating != null ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-extrabold text-gray-900">{Number(overallRating).toFixed(1)}</span>
              <div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className={`w-4 h-4 ${i <= Math.round(overallRating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Overall employer rating</p>
              </div>
            </div>
            {brand?.ratings && (
              <div className="space-y-2.5 mt-2">
                {RATING_LABELS.map(([key, label]) => {
                  const val = brand.ratings![key] ?? 0
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-36 shrink-0">{label}</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-400 rounded-full" style={{ width: `${(val / 5) * 100}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 w-6 text-right">{Number(val).toFixed(1)}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">
            No ratings yet. Ratings appear here once employees submit verified reviews.
          </p>
        )}
      </div>

      {/* Reviews — read-only notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-gray-900">Employee reviews</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Reviews are submitted anonymously by current and former employees.
              You <strong>cannot edit or delete</strong> reviews. If a review is defamatory or false,
              contact <a href="mailto:support@waiterstation.co.za" className="text-gray-700 underline">support@waiterstation.co.za</a> with details — our team will investigate.
            </p>
          </div>
          <span className="shrink-0 text-[10px] font-bold bg-gray-200 text-gray-500 px-2.5 py-1 rounded-full uppercase tracking-wide">Read-only</span>
        </div>
        {brand && (
          <a href={`/companies/${brand.id}?tab=reviews`} target="_blank" rel="noopener noreferrer"
            className="inline-block mt-3 text-xs font-semibold text-gray-700 hover:text-gray-900 underline">
            View reviews on public profile →
          </a>
        )}
      </div>

      {/* Salary data — read-only notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-gray-900">Salary data</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Salary figures are self-reported by employees and cannot be altered by employers.
              This data helps job seekers make informed decisions.
            </p>
          </div>
          <span className="shrink-0 text-[10px] font-bold bg-gray-200 text-gray-500 px-2.5 py-1 rounded-full uppercase tracking-wide">Read-only</span>
        </div>
      </div>

      {/* Claim brand notice */}
      {!employer?.brand_id && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <h2 className="font-semibold text-blue-900 mb-1">Link to a verified brand profile</h2>
          <p className="text-xs text-blue-700 leading-relaxed">
            If your company has a brand profile on Waiterstation, you can request to link your account to it.
            This unlocks a verified badge and consolidates your ratings, reviews, and jobs under one profile.
            Contact <a href="mailto:support@waiterstation.co.za" className="underline font-semibold">support@waiterstation.co.za</a> to request a link.
          </p>
        </div>
      )}
    </div>
  )
}
