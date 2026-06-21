'use client'

import { useState, useMemo } from 'react'
import { ROLE_CATEGORIES, ROLE_LABELS, EMPLOYMENT_TYPE_LABELS, EmploymentType, RoleCategory } from '@/lib/types'
import { MOCK_COMPANIES } from '@/lib/mock-companies'

const EMPLOYMENT_TYPES: EmploymentType[] = ['permanent', 'seasonal', 'event']

const ROLE_ICONS: Record<string, string> = {
  waiter: '🍽️',
  chef: '👨‍🍳',
  kitchen_staff: '🔪',
  housekeeping: '🛏️',
  front_desk: '🏨',
  bartender: '🍸',
  barista: '☕',
  host: '🤝',
  manager: '📋',
  other: '✨',
}

const EMPLOYMENT_DESCRIPTIONS: Record<EmploymentType, string> = {
  permanent: 'Ongoing role',
  seasonal: 'Fixed period',
  event: 'Single event',
}

export default function PostJobForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [role, setRole] = useState<RoleCategory | ''>('')
  const [empType, setEmpType] = useState<EmploymentType | ''>('')

  // Franchise state
  const [isFranchise, setIsFranchise] = useState(false)
  const [brandSearch, setBrandSearch] = useState('')
  const [selectedBrandId, setSelectedBrandId] = useState('')
  const [franchiseName, setFranchiseName] = useState('')
  const [franchiseEmail, setFranchiseEmail] = useState('')
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false)

  const filteredBrands = useMemo(() =>
    MOCK_COMPANIES.filter(c =>
      c.name.toLowerCase().includes(brandSearch.toLowerCase())
    ).slice(0, 8),
    [brandSearch]
  )

  const selectedBrand = MOCK_COMPANIES.find(c => c.id === selectedBrandId)

  function emailDomainValid() {
    if (!selectedBrand?.website || !franchiseEmail) return true
    const brandDomain = selectedBrand.website.replace(/^www\./, '').toLowerCase()
    const emailDomain = franchiseEmail.split('@')[1]?.toLowerCase() ?? ''
    return emailDomain === brandDomain || emailDomain.endsWith('.' + brandDomain)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!role) { setError('Please select a role category.'); return }
    if (!empType) { setError('Please select an employment type.'); return }
    setLoading(true)
    setError('')

    const form = e.currentTarget
    if (isFranchise) {
      if (!selectedBrandId) { setError('Please select a parent brand.'); setLoading(false); return }
      if (!franchiseName.trim()) { setError('Please enter your branch/franchise name.'); setLoading(false); return }
      if (!franchiseEmail.trim()) { setError('Please provide a corporate email for brand verification.'); setLoading(false); return }
      if (!emailDomainValid()) {
        setError(`Your email domain must match ${selectedBrand?.website}. Use your corporate email address.`)
        setLoading(false); return
      }
    }

    const data = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      role_category: role,
      location: (form.elements.namedItem('location') as HTMLInputElement).value,
      employment_type: empType,
      pay: (form.elements.namedItem('pay') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      employer_name: isFranchise ? franchiseName.trim() : (form.elements.namedItem('employer_name') as HTMLInputElement).value,
      contact_method: (form.elements.namedItem('contact_method') as HTMLInputElement).value,
      ...(isFranchise && {
        parent_company_id: selectedBrandId,
        franchise_name: franchiseName.trim(),
        franchise_email: franchiseEmail.trim(),
        brand_link_status: 'pending',
      }),
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
      <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-bold text-gray-900 text-2xl">Listing submitted!</h2>
        <p className="text-gray-500 text-sm mt-3 leading-relaxed max-w-xs mx-auto">
          Your job will go live once we have reviewed it — usually within a few hours during business hours.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <a href="/employer"
            className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-gray-800 transition">
            View my listings
          </a>
          <a href="/post-job"
            className="border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-gray-50 transition">
            Post another job
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Role category */}
      <Card step="1" title="What role are you hiring for?" required>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ROLE_CATEGORIES.map(r => {
            const icon = ROLE_ICONS[r] ?? '✨'
            const selected = role === r
            return (
              <button key={r} type="button" onClick={() => setRole(r === role ? '' : r)}
                className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl border-2 text-center transition group ${
                  selected
                    ? 'border-gray-700 bg-gray-100'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}>
                <span className="text-2xl leading-none">{icon}</span>
                <span className={`text-xs font-semibold leading-tight ${selected ? 'text-gray-800' : 'text-gray-700'}`}>
                  {ROLE_LABELS[r]}
                </span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Employment type */}
      <Card step="2" title="Employment type" required>
        <div className="grid grid-cols-3 gap-2">
          {EMPLOYMENT_TYPES.map(t => {
            const selected = empType === t
            return (
              <button key={t} type="button" onClick={() => setEmpType(t === empType ? '' : t)}
                className={`flex flex-col items-center gap-1.5 px-3 py-4 rounded-xl border-2 transition ${
                  selected
                    ? 'border-gray-700 bg-gray-100'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                <span className={`text-sm font-bold ${selected ? 'text-gray-800' : 'text-gray-800'}`}>
                  {EMPLOYMENT_TYPE_LABELS[t]}
                </span>
                <span className={`text-[11px] ${selected ? 'text-gray-900' : 'text-gray-400'}`}>
                  {EMPLOYMENT_DESCRIPTIONS[t]}
                </span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Job details */}
      <Card step="3" title="Job details">
        <div className="space-y-4">
          <Field label="Job title" required>
            <input name="title" required placeholder="e.g. Experienced Waiter, Head Chef" className={input} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Establishment name" required>
              <input name="employer_name" required placeholder="e.g. The Grand Hotel" className={input} />
            </Field>
            <Field label="Location" required>
              <input name="location" required placeholder="e.g. Cape Town, Sandton" className={input} />
            </Field>
          </div>
          <Field label="Pay" hint="Optional — helps attract more applicants">
            <input name="pay" placeholder="e.g. R6 000/month + tips" className={input} />
          </Field>
        </div>
      </Card>

      {/* Description */}
      <Card step="4" title="Job description" required>
        <textarea name="description" required rows={6}
          placeholder="Describe the role, hours, what kind of candidate you're looking for, and anything else that helps someone decide to apply..."
          className={input + ' resize-none'} />
        <p className="text-xs text-gray-400 mt-1.5">Tip: listings with a clear description get significantly more quality applications.</p>
      </Card>

      {/* Contact */}
      <Card step="5" title="How should applicants reach you?" required>
        <Field label="Phone number or email" required
          hint="Applicants who apply through Waiterstation will receive this to contact you directly">
          <input name="contact_method" required placeholder="+27 82 123 4567 or hello@venue.co.za"
            className={input} inputMode="tel" />
        </Field>
      </Card>

      {/* Franchise / brand link */}
      <Card step="6" title="Is this a franchise or branch of a known brand?">
        <div className="space-y-4">
          {/* Toggle */}
          <button type="button"
            onClick={() => { setIsFranchise(v => !v); setSelectedBrandId(''); setBrandSearch(''); setFranchiseName(''); setFranchiseEmail('') }}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition ${
              isFranchise ? 'border-gray-700 bg-gray-100' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}>
            <div className="flex items-center gap-3">
              <span className="text-xl">🏪</span>
              <div className="text-left">
                <p className={`text-sm font-semibold ${isFranchise ? 'text-gray-900' : 'text-gray-800'}`}>
                  Yes, I'm posting for a franchise / branch
                </p>
                <p className="text-xs text-gray-500 mt-0.5">e.g. Nando's Sandton, Spur Century City</p>
              </div>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${isFranchise ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${isFranchise ? 'left-5' : 'left-1'}`} />
            </div>
          </button>

          {isFranchise && (
            <div className="space-y-4 pt-1">

              {/* Brand search */}
              <Field label="Parent brand" required>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for a brand (e.g. Nando's, Spur...)"
                    value={selectedBrand ? selectedBrand.name : brandSearch}
                    onChange={e => { setBrandSearch(e.target.value); setSelectedBrandId(''); setBrandDropdownOpen(true) }}
                    onFocus={() => setBrandDropdownOpen(true)}
                    className={input}
                    autoComplete="off"
                  />
                  {selectedBrandId && (
                    <button type="button" onClick={() => { setSelectedBrandId(''); setBrandSearch(''); setBrandDropdownOpen(false) }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {brandDropdownOpen && !selectedBrandId && filteredBrands.length > 0 && (
                    <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      {filteredBrands.map(brand => (
                        <button key={brand.id} type="button"
                          onMouseDown={() => { setSelectedBrandId(brand.id); setBrandSearch(''); setBrandDropdownOpen(false) }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition">
                          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-gray-800">{brand.name[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{brand.name}</p>
                            <p className="text-xs text-gray-400">{brand.industry}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {selectedBrand && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-800 bg-gray-100 px-3 py-2 rounded-lg">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Linked to <strong>{selectedBrand.name}</strong> · Your job will appear on their brand page once approved
                  </div>
                )}
              </Field>

              {/* Branch name */}
              <Field label="Your branch / franchise name" required hint="How your specific location is known (e.g. Nando's Sandton, Spur V&A Waterfront)">
                <input
                  type="text"
                  placeholder="e.g. Nando's Sandton"
                  value={franchiseName}
                  onChange={e => setFranchiseName(e.target.value)}
                  className={input}
                />
              </Field>

              {/* Corporate email */}
              <Field label="Corporate / franchise email" required
                hint={selectedBrand ? `Must end in @${selectedBrand.website} to verify you're an authorised ${selectedBrand.name} franchisee` : 'Used to verify you are an authorised franchisee'}>
                <input
                  type="email"
                  placeholder={selectedBrand ? `you@${selectedBrand.website}` : 'your@corporate-email.co.za'}
                  value={franchiseEmail}
                  onChange={e => setFranchiseEmail(e.target.value)}
                  className={input}
                />
                {franchiseEmail && selectedBrand && (
                  emailDomainValid()
                    ? <p className="text-xs text-gray-900 mt-1.5 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Domain matches — your request will go to admin for final approval
                      </p>
                    : <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        Email domain must be @{selectedBrand.website}
                      </p>
                )}
              </Field>

              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700 leading-relaxed">
                <strong>How it works:</strong> Your job will be submitted for normal review. The brand link is reviewed separately — once approved, your listing appears on the {selectedBrand?.name ?? 'brand'} page, labelled as a franchise. Applications still go directly to you.
              </div>
            </div>
          )}
        </div>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <button type="submit" disabled={loading}
        className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl text-base hover:bg-gray-800 active:bg-gray-900 transition disabled:opacity-60 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting...
          </>
        ) : (
          'Submit listing'
        )}
      </button>

      <p className="text-xs text-gray-400 text-center pb-4">
        Free during beta · Reviewed before going live
      </p>
    </form>
  )
}

function Card({ step, title, required, children }: {
  step: string; title: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
          {step}
        </span>
        <h2 className="font-bold text-gray-900 text-base">
          {title}{required && <span className="text-gray-700 ml-0.5">*</span>}
        </h2>
      </div>
      {children}
    </div>
  )
}

function Field({ label, hint, required, children }: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}{required && <span className="text-gray-700 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      {children}
    </div>
  )
}

const input = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white focus:border-gray-500 placeholder:text-gray-400 transition'
