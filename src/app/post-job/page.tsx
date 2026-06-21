import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/supabase-server'
import PostJobForm from './PostJobForm'

export const metadata: Metadata = {
  title: 'Post a Job | Waiterstation',
  description: 'Post a hospitality job in South Africa. Free during beta.',
}

export default async function PostJobPage() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/login?next=/post-job&role=employer')
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Free during beta
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Post a job on Waiterstation
          </h1>
          <p className="text-gray-500 mt-2 text-base max-w-lg">
            Reach thousands of hospitality workers across South Africa. Your listing goes live after a quick review — usually within a few hours.
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

          {/* Form */}
          <div>
            <PostJobForm />
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">How it works</h3>
              <ol className="space-y-4">
                {[
                  { n: '1', title: 'Fill in the form', body: 'Tell us about the role, your venue, and what you need.' },
                  { n: '2', title: 'We review it', body: 'Our team checks every listing — usually within a few hours on weekdays.' },
                  { n: '3', title: 'Go live', body: 'Your job is visible to thousands of hospitality workers in SA.' },
                  { n: '4', title: 'Receive applications', body: 'Applicants contact you directly via your provided number or email.' },
                ].map(step => (
                  <li key={step.n} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {step.n}
                    </span>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{step.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="font-bold text-emerald-800 text-sm">Free during beta</p>
              </div>
              <ul className="space-y-2">
                {[
                  'Unlimited listings while in beta',
                  'Applications go directly to you',
                  'Reach workers across South Africa',
                  'No commission, no hidden fees',
                ].map(t => (
                  <li key={t} className="text-xs text-emerald-700 flex items-start gap-2">
                    <span className="mt-0.5 shrink-0">·</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-xs text-gray-500 leading-relaxed">
                Questions? Email us at{' '}
                <a href="mailto:hello@waiterstation.co.za" className="text-emerald-600 hover:underline font-medium">
                  hello@waiterstation.co.za
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
