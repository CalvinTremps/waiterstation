'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Brand { id: string; name: string }
interface Franchise { id: string; name: string; brand_id: string | null; brands?: { name: string } | null }

const FIELD = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400'

const ROLES = [
  'waiter', 'bartender', 'chef', 'barista', 'kitchen-staff', 'host-hostess',
  'hotel-receptionist', 'hotel-housekeeping', 'restaurant-manager', 'sous-chef',
  'pastry-chef', 'food-and-beverage-manager', 'events-coordinator', 'general-worker',
  'cleaner', 'dishwasher', 'delivery-driver', 'cashier',
]

const EMP_TYPES = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temporary', label: 'Temporary' },
]

export default function CreateJobPage() {
  const router = useRouter()
  const [brands, setBrands] = useState<Brand[]>([])
  const [franchises, setFranchises] = useState<Franchise[]>([])
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const [form, setForm] = useState({
    title: '',
    employer_name: '',
    location: '',
    role: 'waiter',
    employment_type: 'full_time',
    description: '',
    salary: '',
    brand_id: '',
    franchise_id: '',
  })

  useEffect(() => {
    Promise.all([fetch('/api/admin/brands'), fetch('/api/admin/franchises')]).then(async ([bRes, fRes]) => {
      const [bJson, fJson] = await Promise.all([bRes.json(), fRes.json()])
      setBrands(bJson.brands ?? [])
      setFranchises(fJson.franchises ?? [])
    })
  }, [])

  const filteredFranchises = form.brand_id
    ? franchises.filter(f => f.brand_id === form.brand_id)
    : franchises

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setErr('')
    const payload = {
      ...form,
      brand_id: form.brand_id || null,
      franchise_id: form.franchise_id || null,
    }
    // Auto-fill employer_name from brand if blank
    if (!payload.employer_name && form.brand_id) {
      const b = brands.find(b => b.id === form.brand_id)
      if (b) payload.employer_name = b.name
    }
    const res = await fetch('/api/admin/jobs-create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json().catch(() => ({}))
    setSaving(false)
    if (!res.ok) { setErr(json.error ?? 'Failed to create job.'); return }
    router.push('/admin/jobs?status=approved')
  }

  function field(key: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <a href="/admin/jobs" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-2">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Jobs
        </a>
        <h1 className="text-2xl font-bold text-gray-900">Post a job</h1>
        <p className="text-sm text-gray-500 mt-1">Create a job listing directly, attributed to a brand or franchise. It goes live immediately.</p>
      </div>

      {err && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">{err}</div>}

      <form onSubmit={submit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        {/* Brand & Franchise attribution */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Parent brand</label>
            <select className={FIELD} value={form.brand_id}
              onChange={e => setForm(f => ({ ...f, brand_id: e.target.value, franchise_id: '' }))}>
              <option value="">No brand</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Franchise location</label>
            <select className={FIELD} value={form.franchise_id} onChange={e => field('franchise_id', e.target.value)}>
              <option value="">No franchise</option>
              {filteredFranchises.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Job title *</label>
          <input className={FIELD} required value={form.title} onChange={e => field('title', e.target.value)}
            placeholder="e.g. Experienced Waiter – Waterfront" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Employer name *</label>
          <input className={FIELD} required value={form.employer_name} onChange={e => field('employer_name', e.target.value)}
            placeholder="Auto-filled from brand if left blank" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Role *</label>
            <select className={FIELD} value={form.role} onChange={e => field('role', e.target.value)}>
              {ROLES.map(r => <option key={r} value={r}>{r.replace(/-/g, ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Employment type</label>
            <select className={FIELD} value={form.employment_type} onChange={e => field('employment_type', e.target.value)}>
              {EMP_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Location *</label>
          <input className={FIELD} required value={form.location} onChange={e => field('location', e.target.value)}
            placeholder="e.g. Cape Town, Western Cape" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Salary / pay range</label>
          <input className={FIELD} value={form.salary} onChange={e => field('salary', e.target.value)}
            placeholder="e.g. R6 000–R8 000/month + tips" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Job description</label>
          <textarea className={`${FIELD} h-36 resize-none`} value={form.description}
            onChange={e => field('description', e.target.value)}
            placeholder="Duties, requirements, what makes this role great..." />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <a href="/admin/jobs" className="text-sm font-medium text-gray-500 px-4 py-2">Cancel</a>
          <button type="submit" disabled={saving}
            className="bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2 rounded-lg">
            {saving ? 'Posting...' : 'Post job'}
          </button>
        </div>
      </form>
    </div>
  )
}
