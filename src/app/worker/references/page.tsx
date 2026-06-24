'use client'

import { useState } from 'react'
import { MOCK_REFERENCES, Reference } from '@/lib/mock-worker'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  )
}

function RefCard({ ref: r }: { ref: Reference }) {
  const [expanded, setExpanded] = useState(false)
  const preview = r.message.length > 160 ? r.message.slice(0, 160) + '…' : r.message

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full ${r.avatar_color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
          {r.avatar_initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-900">{r.referee_name}</p>
            {r.verified ? (
              <span className="flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                Verified
              </span>
            ) : (
              <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Unverified</span>
            )}
          </div>
          <p className="text-xs text-gray-500">{r.referee_role} · {r.company}</p>
          <div className="flex items-center gap-3 mt-1">
            <Stars rating={r.rating} />
            <span className="text-xs text-gray-400">{r.period}</span>
          </div>
        </div>
      </div>

      <blockquote className="mt-4 text-sm text-gray-700 leading-relaxed border-l-2 border-gray-200 pl-4 italic">
        {expanded ? r.message : preview}
      </blockquote>
      {r.message.length > 160 && (
        <button onClick={() => setExpanded(v => !v)}
          className="mt-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition">
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      <div className="mt-3 text-xs text-gray-400">
        Written {new Date(r.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
      </div>
    </div>
  )
}

export default function ReferencesPage() {
  const [refs] = useState<Reference[]>(MOCK_REFERENCES)
  const [showRequest, setShowRequest] = useState(false)
  const [reqEmail, setReqEmail] = useState('')
  const [reqName, setReqName] = useState('')
  const [reqRole, setReqRole] = useState('')
  const [sent, setSent] = useState(false)

  function sendRequest() {
    if (!reqEmail || !reqName) return
    setSent(true)
    setTimeout(() => { setSent(false); setShowRequest(false); setReqEmail(''); setReqName(''); setReqRole('') }, 2500)
  }

  const verified = refs.filter(r => r.verified)
  const avgRating = refs.length ? (refs.reduce((a, r) => a + r.rating, 0) / refs.length).toFixed(1) : '-'

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">References</h1>
          <p className="text-sm text-gray-500 mt-0.5">Verified references from past employers are shown on your profile to employers</p>
        </div>
        <button onClick={() => setShowRequest(v => !v)}
          className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition shrink-0">
          + Request reference
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{refs.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total references</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{verified.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Verified</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">{avgRating}</p>
          <p className="text-xs text-gray-500 mt-0.5">Avg. rating</p>
        </div>
      </div>

      {/* Request form */}
      {showRequest && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
          <p className="font-semibold text-gray-900">Request a reference</p>
          <p className="text-xs text-gray-500">We'll send your past employer an email asking them to write a reference for your profile.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Their name *</label>
              <input value={reqName} onChange={e => setReqName(e.target.value)}
                placeholder="e.g. Carla Fortuin"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Their role</label>
              <input value={reqRole} onChange={e => setReqRole(e.target.value)}
                placeholder="e.g. Restaurant Manager"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Their email address *</label>
            <input value={reqEmail} onChange={e => setReqEmail(e.target.value)}
              type="email" placeholder="e.g. carla@testktichen.co.za"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white" />
          </div>
          <div className="flex gap-2">
            <button onClick={sendRequest}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${sent ? 'bg-green-600 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'}`}>
              {sent ? 'Request sent!' : 'Send request'}
            </button>
            <button onClick={() => setShowRequest(false)}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reference cards */}
      <div className="space-y-4">
        {refs.map(r => <RefCard key={r.id} ref={r} />)}
      </div>

      {/* Tip */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
        <p className="text-xs font-semibold text-amber-800 mb-1">Tip: verified references get 2x more employer interest</p>
        <p className="text-xs text-amber-700">Employers see a verified badge on your profile when a reference is confirmed by the writer directly. Request references from direct managers, not just colleagues.</p>
      </div>
    </div>
  )
}
