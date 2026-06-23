'use client'

import { useState } from 'react'
import { MOCK_NOTICES, MOCK_EMPLOYEES, type Notice } from '@/lib/mock-recruitment'

const CAT_STYLES: Record<Notice['category'], { label: string; bg: string; dot: string }> = {
  urgent:  { label: 'Urgent',  bg: 'bg-red-50 border-red-100',    dot: 'bg-red-500' },
  event:   { label: 'Event',   bg: 'bg-blue-50 border-blue-100',  dot: 'bg-blue-500' },
  policy:  { label: 'Policy',  bg: 'bg-purple-50 border-purple-100', dot: 'bg-purple-500' },
  general: { label: 'General', bg: 'bg-gray-50 border-gray-200',  dot: 'bg-gray-400' },
}

function timeAgo(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (d === 0) return 'Today'
  if (d === 1) return 'Yesterday'
  return `${d}d ago`
}

export default function NoticesPage() {
  const employees = MOCK_EMPLOYEES.filter(e => e.status !== 'terminated')
  const [notices, setNotices] = useState<Notice[]>(MOCK_NOTICES)
  const [showCreate, setShowCreate] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Create form
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [newCategory, setNewCategory] = useState<Notice['category']>('general')
  const [newPinned, setNewPinned] = useState(false)

  const pinned = notices.filter(n => n.pinned).sort((a, b) => b.created_at.localeCompare(a.created_at))
  const unpinned = notices.filter(n => !n.pinned).sort((a, b) => b.created_at.localeCompare(a.created_at))
  const allSorted = [...pinned, ...unpinned]

  function createNotice(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle || !newBody) return
    const notice: Notice = {
      id: `n-${Date.now()}`,
      title: newTitle,
      body: newBody,
      category: newCategory,
      pinned: newPinned,
      author: 'You',
      created_at: new Date().toISOString(),
      read_by: [],
    }
    setNotices(prev => [notice, ...prev])
    setShowCreate(false)
    setNewTitle(''); setNewBody(''); setNewCategory('general'); setNewPinned(false)
  }

  function togglePin(id: string) {
    setNotices(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n))
  }

  function deleteNotice(id: string) {
    setNotices(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notice Board</h1>
          <p className="text-sm text-gray-500 mt-0.5">{notices.length} notice{notices.length !== 1 ? 's' : ''} · {pinned.length} pinned</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Post Notice
        </button>
      </div>

      {/* Notices */}
      <div className="space-y-3">
        {allSorted.map(notice => {
          const style = CAT_STYLES[notice.category]
          const isExpanded = expandedId === notice.id
          const readCount = notice.read_by.length
          const readPct = employees.length > 0 ? Math.round((readCount / employees.length) * 100) : 0
          return (
            <div key={notice.id} className={`border rounded-xl overflow-hidden ${style.bg}`}>
              <button className="w-full text-left px-4 py-4" onClick={() => setExpandedId(isExpanded ? null : notice.id)}>
                <div className="flex items-start gap-3">
                  {notice.pinned && (
                    <svg className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2.586l1.707 1.707A1 1 0 0117 11H3a1 1 0 01-.707-1.707L4 7.586V5zm2 8a3 3 0 106 0H7z"/>
                    </svg>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`}/>
                        <p className="text-sm font-semibold text-gray-900">{notice.title}</p>
                        <span className="text-[10px] font-semibold text-gray-500 border border-gray-300 px-1.5 py-0.5 rounded-full">
                          {style.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 shrink-0">{timeAgo(notice.created_at)}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">By {notice.author}</p>
                    {!isExpanded && (
                      <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">{notice.body}</p>
                    )}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-gray-700 leading-relaxed">{notice.body}</p>

                  {/* Read receipts */}
                  <div className="bg-white/70 rounded-xl px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-700">Read by staff</p>
                      <p className="text-xs text-gray-500">{readCount}/{employees.length} ({readPct}%)</p>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-green-400 rounded-full transition-all" style={{ width: `${readPct}%` }}/>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {employees.map(emp => {
                        const hasRead = notice.read_by.includes(emp.id)
                        return (
                          <div key={emp.id} title={emp.name}
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                              hasRead ? `${emp.avatar_color} text-white` : 'bg-gray-200 text-gray-400'
                            }`}>
                            {emp.avatar_initials}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => togglePin(notice.id)}
                      className="text-xs font-semibold border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-white/60 transition">
                      {notice.pinned ? 'Unpin' : 'Pin'}
                    </button>
                    <button onClick={() => deleteNotice(notice.id)}
                      className="text-xs font-semibold border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {allSorted.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-sm text-gray-400">No notices posted yet</p>
          </div>
        )}
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowCreate(false)}/>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Post Notice</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <form onSubmit={createNotice} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title *</label>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} required
                  placeholder="e.g. New uniform policy from Monday"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Message *</label>
                <textarea value={newBody} onChange={e => setNewBody(e.target.value)} required rows={5}
                  placeholder="Write your notice here…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"/>
              </div>
              <div className="flex gap-3 flex-wrap">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select value={newCategory} onChange={e => setNewCategory(e.target.value as Notice['category'])}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
                    <option value="general">General</option>
                    <option value="urgent">Urgent</option>
                    <option value="event">Event</option>
                    <option value="policy">Policy</option>
                  </select>
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newPinned} onChange={e => setNewPinned(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"/>
                    <span className="text-sm text-gray-700">Pin to top</span>
                  </label>
                </div>
              </div>
              <button type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-lg transition">
                Post to all staff
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
