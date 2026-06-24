import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCruiseLine, CRUISE_LINES, CRUISE_ROLES, CRUISE_FAQS } from '@/lib/cruise'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://waiterstation.co.za'

type Params = Promise<{ line: string }>

export const dynamicParams = false
export function generateStaticParams() {
  return CRUISE_LINES.map(l => ({ line: l.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { line: slug } = await params
  const line = getCruiseLine(slug)
  if (!line) return { title: 'Cruise Jobs Not Found' }
  const title = `${line.name} Jobs for South Africans | Waiterstation`
  const description = `How South Africans get ${line.name} cruise ship jobs, waiter, bartender, housekeeping and galley roles, pay, requirements and how to apply.`
  return { title, description, alternates: { canonical: `${SITE_URL}/cruise-ship-jobs/${line.slug}` } }
}

export default async function CruiseLinePage({ params }: { params: Params }) {
  const { line: slug } = await params
  const line = getCruiseLine(slug)
  if (!line) notFound()

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CRUISE_FAQS.map(f => ({
      '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <nav className="text-xs text-gray-400 mb-3 flex items-center gap-1.5 flex-wrap">
        <a href="/" className="hover:text-gray-700">Home</a><span>›</span>
        <a href="/cruise-ship-jobs" className="hover:text-gray-700">Cruise Ship Jobs</a><span>›</span>
        <span className="text-gray-600">{line.name}</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{line.name} Jobs for South Africans</h1>
      <p className="text-sm text-gray-600 mt-3 leading-relaxed">{line.blurb} Below are the main hospitality roles
        {' '}{line.name} hires for, plus how to apply from South Africa.</p>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Roles {line.name} hires</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {CRUISE_ROLES.map(r => (
            <div key={r.name} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-900">{r.name}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{r.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">How to apply</h2>
        <ol className="space-y-2 text-sm text-gray-600 list-decimal pl-5 leading-relaxed">
          <li>Get a valid passport, seafarer medical certificate, and STCW safety training.</li>
          <li>Prepare a one-page hospitality CV.</li>
          <li>Apply through accredited agencies that recruit for {line.name}.</li>
          <li>Prepare for a 6–9 month contract and a skills assessment.</li>
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Other cruise lines</h2>
        <div className="flex flex-wrap gap-2">
          {CRUISE_LINES.filter(l => l.slug !== line.slug).map(l => (
            <a key={l.slug} href={`/cruise-ship-jobs/${l.slug}`}
              className="text-xs font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-full transition">
              {l.name} jobs
            </a>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">FAQ</h2>
        <div className="space-y-3">
          {CRUISE_FAQS.map(f => (
            <div key={f.q} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-900">{f.q}</p>
              <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
