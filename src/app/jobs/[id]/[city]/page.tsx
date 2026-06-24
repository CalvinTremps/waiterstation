import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getSession } from '@/lib/supabase-server'
import { withTimeout } from '@/lib/with-timeout'
import { searchJobs } from '@/lib/job-search'
import { getSeoRole, getSeoLocation, SEO_ROLES, SEO_LOCATIONS, allSeoJobParams } from '@/lib/seo-pages'
import JobBrowser from '@/components/JobBrowser'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://waiterstation.co.za'

// Only generated role × city combos are valid, anything else 404s.
export const dynamicParams = false
export function generateStaticParams() {
  return allSeoJobParams().map(({ role, city }) => ({ id: role, city }))
}

// Note: the first dynamic segment is named `id` to match the sibling
// /jobs/[id] (job detail) route, Next requires one slug name per level.
// Here it carries the role slug (e.g. "waiter").
type Params = Promise<{ id: string; city: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id: roleSlug, city: citySlug } = await params
  const role = getSeoRole(roleSlug)
  const loc = getSeoLocation(citySlug)
  if (!role || !loc) return { title: 'Jobs Not Found' }

  const where = loc.region ? `${loc.name}, ${loc.region}` : loc.name
  const title = `${role.label} Jobs in ${loc.name} | Waiterstation`
  const description = `Find ${role.label.toLowerCase()} jobs in ${where}. Browse the latest hospitality vacancies and apply in seconds.`
  const canonical = `${SITE_URL}/jobs/${role.slug}/${loc.slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: 'website' },
  }
}

export default async function RoleCityJobsPage({ params }: { params: Params }) {
  const { id: roleSlug, city: citySlug } = await params
  const role = getSeoRole(roleSlug)
  const loc = getSeoLocation(citySlug)
  if (!role || !loc) notFound()

  let session = null
  try { session = await withTimeout(getSession(), 3000) } catch {}

  // National / province pages aggregate everything (job locations don't
  // contain the province name), so they don't apply a location filter.
  const isAggregate = !loc.region || loc.region === 'South Africa'

  const { jobs, totalLive, isMockData } = await searchJobs({
    role: role.roleCategory,
    location: isAggregate ? undefined : loc.name,
    q: role.query,
  })

  const heading = `${role.label} Jobs in ${loc.name}`
  const where = loc.region ? `${loc.name}, ${loc.region}` : loc.name

  // Related internal links, other roles here, same role in other cities.
  const otherRoles = SEO_ROLES.filter(r => r.slug !== role.slug && r.roleCategory).slice(0, 6)
  const otherCities = SEO_LOCATIONS.filter(l => l.slug !== loc.slug).slice(0, 8)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Jobs', item: `${SITE_URL}/jobs` },
          { '@type': 'ListItem', position: 3, name: loc.name, item: `${SITE_URL}/jobs/hospitality/${loc.slug}` },
          { '@type': 'ListItem', position: 4, name: heading, item: `${SITE_URL}/jobs/${role.slug}/${loc.slug}` },
        ],
      },
      {
        '@type': 'ItemList',
        name: heading,
        numberOfItems: jobs.length,
        itemListElement: jobs.slice(0, 25).map((j, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/jobs/${j.id}`,
          name: j.title,
        })),
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* SEO content header */}
      <section className="bg-white px-5 md:px-8 pt-6 pb-5 max-w-[1440px] mx-auto w-full">
        <nav className="text-xs text-gray-400 mb-3 flex items-center gap-1.5 flex-wrap">
          <a href="/" className="hover:text-gray-700">Home</a><span>›</span>
          <a href="/jobs" className="hover:text-gray-700">Jobs</a><span>›</span>
          <a href={`/jobs/hospitality/${loc.slug}`} className="hover:text-gray-700">{loc.name}</a><span>›</span>
          <span className="text-gray-600">{role.label}</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{heading}</h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-3xl">
          {role.intro ?? `Browse ${role.label.toLowerCase()} jobs`} in {where}. Find permanent, seasonal and part-time
          positions at restaurants, hotels, bars and venues across {loc.name}. Apply in seconds.
        </p>

        {/* Related searches (internal linking) — subtle text links */}
        <div className="mt-4 text-xs text-gray-400 leading-relaxed">
          <span className="font-semibold text-gray-500">Related searches:&nbsp;</span>
          {otherRoles.map((r, i) => (
            <span key={r.slug}>
              {i > 0 && <span className="text-gray-300"> · </span>}
              <a href={`/jobs/${r.slug}/${loc.slug}`} className="text-gray-500 hover:text-violet-700 hover:underline">
                {r.label} jobs in {loc.name}
              </a>
            </span>
          ))}
          {otherCities.map(l => (
            <span key={l.slug}>
              <span className="text-gray-300"> · </span>
              <a href={`/jobs/${role.slug}/${l.slug}`} className="text-gray-500 hover:text-violet-700 hover:underline">
                {role.label} jobs in {l.name}
              </a>
            </span>
          ))}
        </div>
      </section>

      <JobBrowser
        jobs={jobs}
        currentRole={role.roleCategory ?? ''}
        currentType=""
        currentLocation={loc.name}
        currentQuery={role.query ?? ''}
        payOnly={false}
        isMockData={isMockData}
        totalLive={totalLive}
        isLoggedIn={!!session}
        basePath="/jobs"
      />
    </>
  )
}
