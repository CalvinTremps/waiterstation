import type { Metadata } from 'next'
import { GUIDES } from '@/lib/guides'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://waiterstation.co.za'

export const metadata: Metadata = {
  title: 'Hospitality Career Guides | Waiterstation',
  description: 'Free guides for hospitality workers in South Africa, job descriptions, how to become a chef, writing a hospitality CV, and interview questions.',
  alternates: { canonical: `${SITE_URL}/guides` },
}

export default function GuidesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 pb-24">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Hospitality Career Guides</h1>
      <p className="text-sm text-gray-600 mt-3 leading-relaxed">
        Practical guides for hospitality workers in South Africa, what roles involve, how to break in, and how to
        land the job.
      </p>
      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        {GUIDES.map(g => (
          <a key={g.slug} href={`/guides/${g.slug}`}
            className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-violet-300 hover:shadow-sm transition">
            <p className="text-sm font-bold text-gray-900 leading-snug">{g.title}</p>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-3">{g.intro}</p>
            <p className="text-xs font-semibold text-violet-700 mt-3">Read guide →</p>
          </a>
        ))}
      </div>
    </div>
  )
}
