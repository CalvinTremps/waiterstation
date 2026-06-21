'use client'

import { useState } from 'react'
import { CAREER_TIPS } from '@/lib/mock-worker'

const CATEGORY_COLORS: Record<string, string> = {
  Interview: 'bg-blue-50 text-blue-700',
  Pay: 'bg-gray-100 text-gray-800',
  Career: 'bg-purple-50 text-purple-700',
  CV: 'bg-amber-50 text-amber-700',
  Rights: 'bg-red-50 text-red-700',
  Event: 'bg-orange-50 text-orange-700',
}

const CATEGORIES = ['All', ...Array.from(new Set(CAREER_TIPS.map(t => t.category)))]

function renderContent(content: string) {
  return content.split('\n\n').map((para, i) => {
    if (para.startsWith('**') && para.endsWith('**')) {
      return <h3 key={i} className="font-bold text-gray-900 mt-4 mb-1">{para.replace(/\*\*/g, '')}</h3>
    }
    const parts = para.split(/(\*\*[^*]+\*\*)/)
    return (
      <p key={i} className="text-sm text-gray-700 leading-relaxed mt-2">
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j}>{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    )
  })
}

export default function TipsPage() {
  const [category, setCategory] = useState('All')
  const [openId, setOpenId] = useState<string | null>(null)
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())

  const filtered = CAREER_TIPS.filter(t => category === 'All' || t.category === category)

  function toggleBookmark(id: string) {
    setBookmarked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggle(id: string) {
    setOpenId(prev => prev === id ? null : id)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Career Tips</h1>
        <p className="text-sm text-gray-500 mt-0.5">Advice for hospitality workers in South Africa</p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
              category === cat
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Tips list */}
      <div className="space-y-3">
        {filtered.map(tip => {
          const isOpen = openId === tip.id
          const isBookmarked = bookmarked.has(tip.id)
          return (
            <div key={tip.id}
              className={`bg-white border rounded-xl overflow-hidden transition ${
                isOpen ? 'border-gray-300' : 'border-gray-200'
              }`}>
              <div className="flex items-center gap-4 px-5 py-4">
                <button type="button" onClick={() => toggle(tip.id)}
                  className="flex-1 flex items-start gap-4 text-left min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${CATEGORY_COLORS[tip.category] ?? 'bg-gray-100 text-gray-600'}`}>
                        {tip.category}
                      </span>
                      <span className="text-[11px] text-gray-400">{tip.time_read} read</span>
                    </div>
                    <p className="font-semibold text-gray-900 leading-snug">{tip.title}</p>
                  </div>
                  <svg className={`w-5 h-5 text-gray-400 shrink-0 mt-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button onClick={() => toggleBookmark(tip.id)}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                  className={`shrink-0 p-1.5 rounded-lg transition ${
                    isBookmarked
                      ? 'text-gray-900 bg-gray-100'
                      : 'text-gray-300 hover:text-gray-500 hover:bg-gray-50'
                  }`}>
                  <svg className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>

              {isOpen && (
                <div className="px-5 pb-6 border-t border-gray-100 pt-4">
                  <div className="prose-sm">
                    {renderContent(tip.content)}
                  </div>
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Was this helpful?</span>
                    {['Yes', 'No'].map(v => (
                      <button key={v}
                        className="text-xs font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition">
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="font-medium">No tips in this category yet</p>
        </div>
      )}

      {/* Footer note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-3 items-start">
        <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-gray-500 leading-relaxed">
          These tips are written for South African hospitality workers. Employment law references are based on the
          Basic Conditions of Employment Act and the Sectoral Determination for Hospitality as of 2025.
          For specific legal advice, consult a registered labour law practitioner.
        </p>
      </div>
    </div>
  )
}
