'use client'

import { useEffect, useState, useCallback } from 'react'

interface Brand {
  id: string
  name: string
  industry: string
  size: string
  location: string
  description: string
  website: string | null
  logo_url: string | null
  is_active: boolean
  created_at: string
}

const BLANK: Omit<Brand, 'id' | 'created_at'> = {
  name: '', industry: '', size: '', location: '', description: '',
  website: '', logo_url: '', is_active: true,
}

const FIELD = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400'
const INDUSTRIES = ['Restaurant Group', 'Restaurant Chain', 'Hotel Group', 'Fast Food', 'Cafe / Coffee', 'Bar / Nightclub', 'Catering', 'Hospitality Group', 'Other']
const SIZES = ['1–10 employees', '11–50 employees', '51–200 employees', '201–500 employees', '500–1 000 employees', '1 000+ employees']

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [editing, setEditing] = useState<(Omit<Brand, 'id' | 'created_at'> & { id?: string }) | null>(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/brands')
    const json = await res.json().catch(() => ({}))
    if (res.ok) setBrands(json.brands ?? [])
    else setErr(json.error ?? 'Failed to load brands.')
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function save() {
    if (!editing) return
    setSaving(true); setErr('')
    const res = await fetch('/api/admin/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: editing.id ? 'update' : 'create', ...editing }),
    })
    const json = await res.json().catch(() => ({}))
    setSaving(false)
    if (!res.ok) { setErr(json.error ?? 'Save failed.'); return }
    setEditing(null); load()
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    await fetch('/api/admin/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    })
    load()
  }

  const filtered = brands.filter(b =>
    !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="text-sm text-gray-500 mt-1">Manage hospitality brands visible on Waiterstation.</p>
        </div>
        <button onClick={() => setEditing({ ...BLANK })}
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          Add brand
        </button>
      </div>

      {err && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">{err}</div>}

      <input
        className="w-full max-w-sm border border-gray-200 rounded-lg px-3 py-2 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-violet-400"
        placeholder="Search brands..." value={search} onChange={e => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-sm text-gray-400">
          {search ? 'No brands match your search.' : 'No brands yet. Click "Add brand" to create one.'}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(b => (
            <div key={b.id} className={`bg-white border rounded-xl p-4 flex flex-col gap-2 ${b.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
              <div className="flex items-start gap-3">
                {b.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.logo_url} alt={b.name} className="w-10 h-10 rounded-lg object-contain border border-gray-100 bg-white" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm shrink-0">
                    {b.name[0]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 truncate">{b.name}</p>
                  <p className="text-xs text-gray-400 truncate">{b.industry}{b.location ? ` · ${b.location}` : ''}</p>
                </div>
              </div>
              {b.description && <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{b.description}</p>}
              <div className="flex items-center gap-2 mt-auto pt-1">
                {!b.is_active && <span className="text-[10px] font-bold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full uppercase">Inactive</span>}
                <div className="flex gap-2 ml-auto">
                  <button onClick={() => setEditing({ ...b })}
                    className="text-xs font-semibold text-violet-700 hover:text-violet-900 border border-violet-200 px-3 py-1 rounded-lg">
                    Edit
                  </button>
                  <button onClick={() => remove(b.id, b.name)}
                    className="text-xs font-semibold text-red-600 hover:text-red-800 border border-red-100 px-3 py-1 rounded-lg">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">{editing.id ? 'Edit brand' : 'Add brand'}</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Brand name *</label>
                <input className={FIELD} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Industry</label>
                  <select className={FIELD} value={editing.industry} onChange={e => setEditing({ ...editing, industry: e.target.value })}>
                    <option value="">Select...</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Size</label>
                  <select className={FIELD} value={editing.size} onChange={e => setEditing({ ...editing, size: e.target.value })}>
                    <option value="">Select...</option>
                    {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Location (HQ)</label>
                <input className={FIELD} placeholder="e.g. Cape Town (HQ) · Nationwide" value={editing.location} onChange={e => setEditing({ ...editing, location: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                <textarea className={`${FIELD} h-24 resize-none`} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Website</label>
                  <input className={FIELD} placeholder="e.g. nandos.co.za" value={editing.website ?? ''} onChange={e => setEditing({ ...editing, website: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Logo URL</label>
                  <input className={FIELD} placeholder="https://..." value={editing.logo_url ?? ''} onChange={e => setEditing({ ...editing, logo_url: e.target.value })} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={editing.is_active} onChange={e => setEditing({ ...editing, is_active: e.target.checked })} className="rounded" />
                Active (visible on site)
              </label>
            </div>

            {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setEditing(null)} className="text-sm font-medium text-gray-500 px-4 py-2">Cancel</button>
              <button onClick={save} disabled={saving}
                className="bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg">
                {saving ? 'Saving...' : editing.id ? 'Save changes' : 'Create brand'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
