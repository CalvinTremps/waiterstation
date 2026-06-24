import type { Metadata } from 'next'
import { getMarketingPage } from '@/lib/marketing'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getMarketingPage('about')
  return { title: page?.seo_title, description: page?.seo_description }
}

export default async function AboutPage() {
  const page = await getMarketingPage('about')
  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-24 md:py-10 md:pb-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{page?.hero_heading ?? 'About Waiterstation'}</h1>
      {page?.hero_subheading && <p className="text-gray-500 mb-4 leading-relaxed">{page.hero_subheading}</p>}
      <div className="prose prose-sm text-gray-600 space-y-4">
        <p>
          Waiterstation is a job board built for South Africa's tourism and hospitality industry, waiters, chefs, kitchen staff, hotel workers, bartenders, and more.
        </p>
        <p>
          Most job listings elsewhere aren't built for this industry. Waiterstation is. Listings are
          specific, honest, and workers can apply in seconds directly on the platform, with no portals or friction.
        </p>
        <p>
          Employers post for free during our beta. Every listing is reviewed before it goes live.
        </p>

        {/* Why Waiterstation vs. general job boards / classifieds */}
        <h2 className="text-lg font-semibold text-gray-800 mt-6">Why Waiterstation, not a general job board?</h2>
        <p className="not-prose">
          General job boards and classifieds sites list everything from cars to couches alongside the
          occasional waiter ad. Here's how a hospitality-only platform is different:
        </p>
        <div className="not-prose mt-4 grid sm:grid-cols-3 gap-3">
          {[
            { h: 'Hospitality only', b: 'Every listing is a real hospitality role, no scrolling past unrelated ads.' },
            { h: 'Apply in seconds', b: 'No account, no portal. Just your name and number, and applications go straight to the employer.' },
            { h: 'Reviewed listings', b: 'Each job is checked before it goes live, so you waste less time on stale or fake posts.' },
          ].map(c => (
            <div key={c.h} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <svg className="w-4 h-4 text-violet-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm font-bold text-gray-900">{c.h}</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{c.b}</p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mt-6">For workers</h2>
        <p>
          Browse jobs by role, location, and type. When you find something, tap "Apply now" and
          submit your name and phone number. The employer receives your details and reaches out
          directly, no middleman.
        </p>
        <h2 className="text-lg font-semibold text-gray-800 mt-6">For employers</h2>
        <p>
          Post a job in under 2 minutes. It'll go live after a quick review. Applications come in
          through Waiterstation, you get the candidate's details and take it from there.
        </p>
        <div className="mt-8">
          <a href="/post-job" className="bg-violet-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-violet-700 transition text-sm inline-block">
            Post a Job
          </a>
        </div>
      </div>
    </div>
  )
}
