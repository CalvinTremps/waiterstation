'use client'

import { useState } from 'react'
import { MarketingPage } from '@/lib/marketing'

const FIELD = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500'
const LABEL = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'

export default function MarketingEditor({ page }: { page: MarketingPage }) {
  const [form, setForm] = useState(page)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [message, setMessage] = useState('')

  function set<K extends keyof MarketingPage>(key: K, value: MarketingPage[K]) {
    setForm(f => ({ ...f, [key]: value }))
    setStatus('idle')
  }

  async function handleSave() {
    setStatus('saving'); setMessage('')
    try {
      const res = await fetch('/api/admin/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (res.ok) {
        setStatus('saved')
      } else {
        setStatus('error')
        setMessage(json.error ?? 'Could not save.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error.')
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <a href="/admin/marketing" className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition">← Marketing pages</a>

      <div className="flex items-start justify-between gap-4 mt-2 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{form.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            <a href={form.path} target="_blank" rel="noreferrer" className="text-violet-600 hover:underline">{form.path}</a>
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 shrink-0 pt-1 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)}
            className="w-4 h-4 rounded accent-violet-600" />
          Published
        </label>
      </div>

      <div className="space-y-6">
        {/* SEO */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <p className="text-sm font-bold text-gray-900">Search engine (SEO)</p>
          <div>
            <label className={LABEL}>SEO title</label>
            <input className={FIELD} value={form.seo_title} onChange={e => set('seo_title', e.target.value)} />
            <p className="text-[11px] text-gray-400 mt-1">{form.seo_title.length} chars · aim for 50–60</p>
          </div>
          <div>
            <label className={LABEL}>Meta description</label>
            <textarea className={`${FIELD} resize-none`} rows={2} value={form.seo_description} onChange={e => set('seo_description', e.target.value)} />
            <p className="text-[11px] text-gray-400 mt-1">{form.seo_description.length} chars · aim for 140–160</p>
          </div>
        </section>

        {/* Hero */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <p className="text-sm font-bold text-gray-900">Hero</p>
          <div>
            <label className={LABEL}>Heading</label>
            <input className={FIELD} value={form.hero_heading} onChange={e => set('hero_heading', e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Subheading</label>
            <textarea className={`${FIELD} resize-none`} rows={2} value={form.hero_subheading} onChange={e => set('hero_subheading', e.target.value)} />
          </div>
        </section>

        {/* Body */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <p className="text-sm font-bold text-gray-900">Body <span className="font-normal text-gray-400">(optional)</span></p>
          <textarea className={`${FIELD} resize-y leading-relaxed`} rows={6} value={form.body} onChange={e => set('body', e.target.value)}
            placeholder="Longer copy shown below the hero on pages that support it." />
        </section>
      </div>

      {/* Save bar */}
      <div className="sticky bottom-0 mt-6 -mx-8 px-8 py-4 bg-white/90 backdrop-blur border-t border-gray-100 flex items-center justify-end gap-3">
        {status === 'saved' && <span className="text-sm font-medium text-green-600">Saved ✓</span>}
        {status === 'error' && <span className="text-sm font-medium text-red-600">{message}</span>}
        <button onClick={handleSave} disabled={status === 'saving'}
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60">
          {status === 'saving' ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}
