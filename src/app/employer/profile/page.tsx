'use client'

import { useState } from 'react'
import { MOCK_EMPLOYER_PROFILE } from '@/lib/mock-recruitment'

const VENUE_TYPES = [
  'Five-star hotel', 'Boutique hotel', 'Restaurant', 'Wine estate', 'Cocktail bar',
  'Cafe / Coffee shop', 'Fast food / QSR', 'Events venue', 'Catering company', 'Other',
]
const BENEFIT_OPTIONS = [
  'Medical aid', 'Staff meals', 'Provident fund', 'International travel',
  'Training programmes', 'Uniform provided', 'Tip pool', 'Housing allowance',
  'Transport allowance', 'Performance bonus',
]
const SIZE_OPTIONS = ['1–10 employees', '11–50 employees', '51–200 employees', '200–500 employees', '500+ employees']

export default function ProfilePage() {
  const [profile, setProfile] = useState(MOCK_EMPLOYER_PROFILE)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

  function set(key: string, value: string | string[] | Record<string, string>) {
    setProfile(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function toggleBenefit(b: string) {
    set('benefits', profile.benefits.includes(b)
      ? profile.benefits.filter(x => x !== b)
      : [...profile.benefits, b]
    )
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Visible to all job seekers on Waiterstation</p>
        </div>
        <a href={`/companies`} target="_blank"
          className="text-xs text-emerald-600 font-medium hover:underline flex items-center gap-1">
          View public page
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['edit','preview'] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition capitalize ${
              activeTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'preview' ? (
        /* Preview */
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 h-20 relative">
            <div className="absolute -bottom-6 left-5 w-14 h-14 bg-white rounded-xl border-2 border-white shadow flex items-center justify-center text-2xl font-bold text-gray-700">
              {profile.name.charAt(0)}
            </div>
          </div>
          <div className="px-5 pt-10 pb-5">
            <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{profile.venue_type} · {profile.location}</p>
            <p className="text-sm text-gray-500 mt-0.5">{profile.size}</p>
            <p className="text-sm text-gray-700 mt-4 leading-relaxed">{profile.description}</p>
            {profile.benefits.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Benefits</p>
                <div className="flex flex-wrap gap-2">
                  {profile.benefits.map(b => (
                    <span key={b} className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">{b}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Edit form */
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Basic Information</h2>

            <Field label="Company name" required>
              <input value={profile.name} onChange={e => set('name', e.target.value)}
                className={input} placeholder="e.g. One&Only Cape Town" />
            </Field>

            <Field label="Venue type">
              <select value={profile.venue_type} onChange={e => set('venue_type', e.target.value)}
                className={input}>
                {VENUE_TYPES.map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>

            <Field label="Location" required>
              <input value={profile.location} onChange={e => set('location', e.target.value)}
                className={input} placeholder="e.g. V&A Waterfront, Cape Town" />
            </Field>

            <Field label="Company size">
              <select value={profile.size} onChange={e => set('size', e.target.value)}
                className={input}>
                {SIZE_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>

            <Field label="Website">
              <input value={profile.website} onChange={e => set('website', e.target.value)}
                className={input} placeholder="https://yourwebsite.co.za" />
            </Field>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">About Your Venue</h2>
            <Field label="Description" hint="Shown to all job seekers — make it compelling">
              <textarea value={profile.description} onChange={e => set('description', e.target.value)}
                rows={5} className={input + ' resize-none'}
                placeholder="Tell job seekers what makes your venue special..." />
            </Field>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 mb-1">Benefits Offered</h2>
            <p className="text-xs text-gray-400 mb-3">Select all that apply</p>
            <div className="grid grid-cols-2 gap-2">
              {BENEFIT_OPTIONS.map(b => (
                <button key={b} type="button" onClick={() => toggleBenefit(b)}
                  className={`flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg border text-left transition ${
                    profile.benefits.includes(b)
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                  <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    profile.benefits.includes(b) ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'
                  }`}>
                    {profile.benefits.includes(b) && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                    )}
                  </span>
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Social Media</h2>
            <Field label="Instagram handle">
              <input value={profile.social.instagram} onChange={e => set('social', { ...profile.social, instagram: e.target.value })}
                className={input} placeholder="@yourhandle" />
            </Field>
            <Field label="Facebook page">
              <input value={profile.social.facebook} onChange={e => set('social', { ...profile.social, facebook: e.target.value })}
                className={input} placeholder="YourPageName" />
            </Field>
          </div>

          <div className="flex items-center gap-3 pb-6">
            <button onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition">
              Save changes
            </button>
            {saved && (
              <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                Saved!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, hint, required, children }: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">
        {label}{required && <span className="text-emerald-600 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      {children}
    </div>
  )
}

const input = 'w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-gray-400'
