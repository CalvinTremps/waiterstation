'use client'

import { useEffect, useState, useCallback } from 'react'

interface Brand { id: string; name: string }
interface Franchise {
  id: string
  brand_id: string | null
  name: string
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  location: string
  is_active: boolean
  created_at: string
  brands?: { name: string } | null
}

const BLANK = {
  brand_id: '', name: '', contact_name: '', contact_email: '',
  contact_phone: '', location: '', is_active: true,
}

const FIELD = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400'

export default function FranchisesPage() {
  const [franchises, setFranchises] = useState<Franchise[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [editing, setEditing] = useState<(typeof BLANK & { id?: string }) | null>(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const [fRes, bRes] = await Promise.all([fetch('/api/admin/franchises'), fetch('/api/admin/brands')])
    const [fJson, bJson] = await Promise.all([fRes.json().catch(() => ({})), bRes.json().catch(() => ({}))])
    if (fRes.ok) setFranchises(fJson.franchises ?? [])
    if (bRes.ok) setBrands(bJson.brands ?? [])
    else setErr(fJson.error ?? 'Failed to load.')
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function save() {
    if (!editing) return
    setSaving(true); setErr('')
    const payload = { ...editing, brand_id: editing.brand_id || null }
    const res = await fetch('/api/admin/franchises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: editing.id ? 'update' : 'create', ...payload }),
    })
    const json = await res.json().catch(() => ({}))
    setSaving(false)
    if (!res.ok) { setErr(json.error ?? 'Save failed.'); return }
    setEditing(null); load()
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Delete franchise "${name}"?`)) return
    await fetch('/api/admin/franchises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    })
    load()
  }

  const filtered = franchises.filter(f =>
    !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Franchises</h1>
          <p className="text-sm text-gray-500 mt-1">Manage franchise locations attributed to parent brands.</p>
        </div>
        <button onClick={() => setEditing({ ...BLANK })}
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          Add franchise
        </button>
      </div>

      {err && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">{err}</div>}

      <input
        className="w-full max-w-sm border border-gray-200 rounded-lg px-3 py-2 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-violet-400"
        placeholder="Search franchises..." value={search} onChange={e => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-sm text-gray-400">
          {search ? 'No franchises match your search.' : 'No franchises yet. Click "Add franchise" to create one.'}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(f => (
            <div key={f.id} className={`bg-white border rounded-xl p-4 flex items-center gap-4 flex-wrap ${f.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 truncate">{f.name}</p>
                  {f.brands?.name && (
                    <span className="text-[10px] font-bold bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full">{f.brands.name}</span>
                  )}
                  {!f.is_active && <span className="text-[10px] font-bold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full uppercase">Inactive</span>}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{f.location}</p>
                {f.contact_name && <p className="text-xs text-gray-400">{f.contact_name}{f.contact_phone ? ` · ${f.contact_phone}` : ''}{f.contact_email ? ` · ${f.contact_email}` : ''}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing({ brand_id: f.brand_id ?? '', name: f.name, contact_name: f.contact_name ?? '', contact_email: f.contact_email ?? '', contact_phone: f.contact_phone ?? '', location: f.location, is_active: f.is_active, id: f.id })}
                  className="text-xs font-semibold text-violet-700 hover:text-violet-900 border border-violet-200 px-3 py-1.5 rounded-lg">
                  Edit
                </button>
                <button onClick={() => remove(f.id, f.name)}
                  className="text-xs font-semibold text-red-600 hover:text-red-800 border border-red-100 px-3 py-1.5 rounded-lg">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">{editing.id ? 'Edit franchise' : 'Add franchise'}</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Parent brand</label>
                <select className={FIELD} value={editing.brand_id} onChange={e => setEditing({ ...editing, brand_id: e.target.value })}>
                  <option value="">No parent brand</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Franchise name *</label>
                <input className={FIELD} placeholder="e.g. Nando's V&A Waterfront" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Location</label>
                <input className={FIELD} placeholder="e.g. V&A Waterfront, Cape Town" value={editing.location} onChange={e => setEditing({ ...editing, location: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Contact name</label>
                  <input className={FIELD} value={editing.contact_name} onChange={e => setEditing({ ...editing, contact_name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Contact phone</label>
                  <input className={FIELD} value={editing.contact_phone} onChange={e => setEditing({ ...editing, contact_phone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Contact email</label>
                <input className={FIELD} type="email" value={editing.contact_email} onChange={e => setEditing({ ...editing, contact_email: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={editing.is_active} onChange={e => setEditing({ ...editing, is_active: e.target.checked })} className="rounded" />
                Active
              </label>
            </div>

            {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setEditing(null)} className="text-sm font-medium text-gray-500 px-4 py-2">Cancel</button>
              <button onClick={save} disabled={saving}
                className="bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg">
                {saving ? 'Saving...' : editing.id ? 'Save changes' : 'Create franchise'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
