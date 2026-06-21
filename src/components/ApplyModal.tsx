'use client'

import { useState, useEffect } from 'react'
import { Job, ROLE_LABELS } from '@/lib/types'

interface Props {
  job: Job
  onClose: () => void
}

export default function ApplyModal({ job, onClose }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: job.id,
          job_title: job.title,
          employer_name: job.employer_name,
          applicant_name: name.trim(),
          applicant_phone: phone.trim(),
          message: message.trim(),
        }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Something went wrong')
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-base">Apply for this role</h2>
            <p className="text-sm text-gray-500 mt-0.5">{job.title} · {job.employer_name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition shrink-0 ml-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Application sent!</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {job.employer_name} will be in touch on <span className="font-medium text-gray-700">{phone}</span>.
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-gray-900 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-800 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Job summary pill */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
              <span className="text-xs font-medium text-gray-500">{ROLE_LABELS[job.role_category]}</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-500">{job.location}</span>
              {job.pay && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs font-semibold text-gray-800">{job.pay}</span>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Your name <span className="text-gray-900">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Thabo Nkosi"
                required
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Phone number <span className="text-gray-900">*</span>
              </label>
              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+27 82 123 4567"
                required
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1">The employer will use this to contact you.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Brief message <span className="text-xs font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Tell the employer a bit about yourself — experience, availability, why you're interested..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder:text-gray-400 resize-none"
              />
            </div>

            {/* POPIA consent */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-gray-900 cursor-pointer shrink-0"
              />
              <span className="text-xs text-gray-500 leading-relaxed">
                I consent to Waiterstation sharing my name and phone number with {job.employer_name} for the purpose of this job application, in accordance with the{' '}
                <a href="/privacy" target="_blank" className="text-gray-900 underline underline-offset-2">Privacy Policy</a> (POPIA).
              </span>
            </label>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim() || !phone.trim() || !consent}
              className="w-full bg-gray-900 text-white font-semibold py-3 rounded-full hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Sending…' : 'Submit application'}
            </button>

            <p className="text-xs text-gray-400 text-center pb-1">
              Your details are shared only with {job.employer_name}.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
