'use client'

import { useState } from 'react'
import { TALENT_POOLS, MOCK_APPLICANTS, type TalentPool } from '@/lib/mock-recruitment'

const ALL_CANDIDATES = [
  ...MOCK_APPLICANTS,
  { id: 'mock-1', name: 'Thabo Nkosi', role_category: 'waiter', location: 'Cape Town, Mitchells Plain', job_title: 'Waiter', avatar_initials: 'TN', avatar_color: 'bg-gray-900' },
  { id: 'mock-6', name: 'Zanele Mokoena', role_category: 'waiter', location: 'Cape Town, Woodstock', job_title: 'Waiter', avatar_initials: 'ZM', avatar_color: 'bg-teal-600' },
  { id: 'mock-3', name: 'Sipho Dlamini', role_category: 'chef', location: 'Johannesburg, Sandton', job_title: 'Chef', avatar_initials: 'SD', avatar_color: 'bg-orange-600' },
  { id: 'mock-4', name: 'Nomsa Vilakazi', role_category: 'manager', location: 'Johannesburg, Rosebank', job_title: 'Manager', avatar_initials: 'NV', avatar_color: 'bg-purple-600' },
  { id: 'mock-9', name: 'Lungelo Khumalo', role_category: 'waiter', location: 'Durban, Umhlanga', job_title: 'Waiter', avatar_initials: 'LK', avatar_color: 'bg-blue-600' },
]

const POOL_COLORS = [
  { bg: 'bg-blue-100 text-blue-800', preview: 'bg-blue-100' },
  { bg: 'bg-amber-100 text-amber-800', preview: 'bg-amber-100' },
  { bg: 'bg-purple-100 text-purple-800', preview: 'bg-purple-100' },
  { bg: 'bg-green-100 text-green-800', preview: 'bg-green-100' },
  { bg: 'bg-rose-100 text-rose-800', preview: 'bg-rose-100' },
]

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

export default function PoolsPage() {
  const [pools, setPools] = useState<TalentPool[]>(TALENT_POOLS)
  const [selectedPool, setSelectedPool] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newColor, setNewColor] = useState(0)
  const [addingTo, setAddingTo] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const activePool = pools.find(p => p.id === selectedPool)

  function createPool() {
    if (!newName.trim()) return
    const pool: TalentPool = {
      id: `pool-${Date.now()}`,
      name: newName.trim(),
      description: newDesc.trim(),
      created_at: new Date().toISOString(),
      candidate_ids: [],
      color: POOL_COLORS[newColor].bg,
    }
    setPools(prev => [...prev, pool])
    setCreating(false)
    setNewName(''); setNewDesc('')
    setSelectedPool(pool.id)
  }

  function removeFromPool(poolId: string, candidateId: string) {
    setPools(prev => prev.map(p => p.id === poolId ? { ...p, candidate_ids: p.candidate_ids.filter(id => id !== candidateId) } : p))
  }

  function addToPool(poolId: string, candidateId: string) {
    setPools(prev => prev.map(p => p.id === poolId ? {
      ...p,
      candidate_ids: p.candidate_ids.includes(candidateId) ? p.candidate_ids : [...p.candidate_ids, candidateId]
    } : p))
  }

  function deletePool(poolId: string) {
    setPools(prev => prev.filter(p => p.id !== poolId))
    if (selectedPool === poolId) setSelectedPool(null)
  }

  const candidatesInPool = activePool
    ? ALL_CANDIDATES.filter(c => activePool.candidate_ids.includes(c.id))
    : []

  const candidatesToAdd = ALL_CANDIDATES.filter(c =>
    !activePool?.candidate_ids.includes(c.id) &&
    (search === '' || c.name.toLowerCase().includes(search.toLowerCase()))
  )

  const input = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-400'

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Talent Pools</h1>
          <p className="text-sm text-gray-500 mt-0.5">Group candidates into pools for quick access when a role opens up.</p>
        </div>
        <button onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New pool
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pool list */}
        <div className="md:col-span-1 space-y-2">
          {pools.map(pool => (
            <button key={pool.id} onClick={() => setSelectedPool(pool.id)}
              className={`w-full text-left p-3 rounded-xl border transition ${
                selectedPool === pool.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${pool.color}`}>
                    {pool.candidate_ids.length}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 truncate">{pool.name}</span>
                </div>
              </div>
              {pool.description && (
                <p className="text-xs text-gray-400 mt-1 truncate">{pool.description}</p>
              )}
            </button>
          ))}

          {pools.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-sm text-gray-400">No pools yet</p>
            </div>
          )}
        </div>

        {/* Pool detail */}
        <div className="md:col-span-2">
          {creating ? (
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              <h2 className="font-semibold text-gray-900">New Talent Pool</h2>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Pool name *</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Cape Town Waiters" className={input} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
                <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="What kind of candidates go in this pool?" className={input} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Colour</label>
                <div className="flex gap-2">
                  {POOL_COLORS.map((c, i) => (
                    <button key={i} onClick={() => setNewColor(i)}
                      className={`w-7 h-7 rounded-full ${c.preview} border-2 transition ${newColor === i ? 'border-gray-900' : 'border-transparent'}`} />
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={createPool} disabled={!newName.trim()}
                  className="bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                  Create pool
                </button>
                <button onClick={() => setCreating(false)} className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2">Cancel</button>
              </div>
            </div>
          ) : activePool ? (
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activePool.color}`}>{activePool.candidate_ids.length}</span>
                    <h2 className="font-semibold text-gray-900">{activePool.name}</h2>
                  </div>
                  {activePool.description && <p className="text-xs text-gray-500 mt-0.5">{activePool.description}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setAddingTo(addingTo === activePool.id ? null : activePool.id)}
                    className="text-xs font-semibold text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
                    + Add candidates
                  </button>
                  <button onClick={() => deletePool(activePool.id)}
                    className="text-xs text-red-500 hover:text-red-700 border border-red-100 hover:border-red-200 px-2 py-1.5 rounded-lg transition">
                    Delete
                  </button>
                </div>
              </div>

              {/* Add candidates search */}
              {addingTo === activePool.id && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search candidates to add…" className={input + ' text-xs'} />
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {candidatesToAdd.slice(0, 8).map(c => (
                      <div key={c.id} className="flex items-center justify-between gap-2 px-2 py-1.5 bg-white border border-gray-100 rounded-lg">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-6 h-6 rounded-full ${(c as any).avatar_color ?? 'bg-gray-500'} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}>
                            {initials(c.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">{c.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{(c as any).location ?? ''}</p>
                          </div>
                        </div>
                        <button onClick={() => addToPool(activePool.id, c.id)}
                          className="text-[10px] font-semibold text-gray-700 border border-gray-200 px-2 py-1 rounded hover:bg-gray-100 transition shrink-0">
                          Add
                        </button>
                      </div>
                    ))}
                    {candidatesToAdd.length === 0 && <p className="text-xs text-gray-400 text-center py-3">No candidates to add</p>}
                  </div>
                  <button onClick={() => setAddingTo(null)} className="text-xs text-gray-400 hover:text-gray-600">Done</button>
                </div>
              )}

              {/* Candidates in pool */}
              {candidatesInPool.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                  <p className="text-sm text-gray-400">No candidates in this pool yet</p>
                  <button onClick={() => setAddingTo(activePool.id)}
                    className="mt-2 text-xs font-semibold text-gray-700 underline underline-offset-2">
                    Add candidates
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {candidatesInPool.map(c => (
                    <div key={c.id} className="flex items-center justify-between gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-full ${(c as any).avatar_color ?? 'bg-gray-500'} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                          {initials(c.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                          <p className="text-xs text-gray-500 truncate">{(c as any).location ?? (c as any).job_title ?? ''}</p>
                        </div>
                      </div>
                      <button onClick={() => removeFromPool(activePool.id, c.id)}
                        className="shrink-0 text-gray-300 hover:text-red-400 transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-sm text-gray-400">Select a pool to view candidates</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
