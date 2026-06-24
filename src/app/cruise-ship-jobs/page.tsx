import type { Metadata } from 'next'
import { CRUISE_LINES, CRUISE_ROLES, CRUISE_FAQS } from '@/lib/cruise'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://waiterstation.co.za'

export const metadata: Metadata = {
  title: 'Cruise Ship Jobs in South Africa | Waiterstation',
  description: 'Find cruise ship hospitality jobs for South Africans — waiter, bartender, housekeeping and galley roles with MSC, Carnival, Royal Caribbean and more. No-experience entry roles and how to apply.',
  alternates: { canonical: `${SITE_URL}/cruise-ship-jobs` },
}

export default function CruiseShipJobsPage() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CRUISE_FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <nav className="text-xs text-gray-400 mb-3 flex items-center gap-1.5 flex-wrap">
        <a href="/" className="hover:text-gray-700">Home</a><span>›</span>
        <a href="/jobs" className="hover:text-gray-700">Jobs</a><span>›</span>
        <span className="text-gray-600">Cruise Ship Jobs</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Cruise Ship Jobs in South Africa</h1>
      <p className="text-sm text-gray-600 mt-3 leading-relaxed">
        Cruise ships are one of the biggest employers of South African hospitality workers. MSC Cruises sails
        seasonally from <strong>Durban</strong> and <strong>Cape Town</strong>, and lines like Carnival, Royal
        Caribbean and Norwegian recruit South African waiters, bartenders, housekeeping and galley crew year-round
        through accredited agencies. Pay is in USD with food and accommodation covered — and there are genuine
        no-experience entry roles to get started.
      </p>

      {/* Roles */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Hospitality roles on cruise ships</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {CRUISE_ROLES.map(r => (
            <div key={r.name} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-900">{r.name}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{r.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lines */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Cruise lines hiring South Africans</h2>
        <div className="space-y-2">
          {CRUISE_LINES.map(l => (
            <a key={l.slug} href={`/cruise-ship-jobs/${l.slug}`}
              className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-violet-300 hover:shadow-sm transition">
              <p className="text-sm font-semibold text-violet-700">{l.name} jobs →</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{l.blurb}</p>
            </a>
          ))}
        </div>
      </section>

      {/* How to apply */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">How to apply from South Africa</h2>
        <ol className="space-y-2 text-sm text-gray-600 list-decimal pl-5 leading-relaxed">
          <li>Get a valid passport, a seafarer medical certificate, and basic STCW safety training.</li>
          <li>Prepare a clear one-page hospitality CV highlighting restaurant, bar or hotel experience.</li>
          <li>Apply through accredited maritime recruitment agencies that supply your chosen lines.</li>
          <li>Be ready for 6–9 month contracts and a structured interview / skills assessment.</li>
        </ol>
      </section>

      {/* FAQ */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Cruise ship jobs FAQ</h2>
        <div className="space-y-3">
          {CRUISE_FAQS.map(f => (
            <div key={f.q} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-900">{f.q}</p>
              <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 mt-8 leading-relaxed">
        Waiterstation lists land-based hospitality jobs across South Africa and curates cruise-industry guidance.
        Always apply through verified agencies and never pay upfront “placement fees”.
      </p>
    </div>
  )
}
