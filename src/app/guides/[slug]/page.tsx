import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getGuide, GUIDES } from '@/lib/guides'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://waiterstation.co.za'

type Params = Promise<{ slug: string }>

export const dynamicParams = false
export function generateStaticParams() {
  return GUIDES.map(g => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const g = getGuide(slug)
  if (!g) return { title: 'Guide Not Found' }
  return {
    title: g.seoTitle,
    description: g.seoDescription,
    alternates: { canonical: `${SITE_URL}/guides/${g.slug}` },
    openGraph: { title: g.seoTitle, description: g.seoDescription, type: 'article' },
  }
}

export default async function GuidePage({ params }: { params: Params }) {
  const { slug } = await params
  const g = getGuide(slug)
  if (!g) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: g.title,
        description: g.seoDescription,
        author: { '@type': 'Organization', name: 'Waiterstation' },
        publisher: { '@type': 'Organization', name: 'Waiterstation' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: g.faqs.map(f => ({
          '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  return (
    <article className="max-w-2xl mx-auto px-4 md:px-6 py-8 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-xs text-gray-400 mb-3 flex items-center gap-1.5 flex-wrap">
        <a href="/" className="hover:text-gray-700">Home</a><span>›</span>
        <a href="/guides" className="hover:text-gray-700">Guides</a><span>›</span>
        <span className="text-gray-600">{g.title}</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-tight">{g.title}</h1>
      <p className="text-base text-gray-600 mt-3 leading-relaxed">{g.intro}</p>

      {g.sections.map(s => (
        <section key={s.heading} className="mt-7">
          <h2 className="text-lg font-bold text-gray-900 mb-2.5">{s.heading}</h2>
          <ul className="space-y-2 text-sm text-gray-600 leading-relaxed list-disc pl-5">
            {s.body.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </section>
      ))}

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">FAQ</h2>
        <div className="space-y-3">
          {g.faqs.map(f => (
            <div key={f.q} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-900">{f.q}</p>
              <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {g.relatedRole && (
        <div className="mt-8 bg-violet-50 border border-violet-100 rounded-xl p-5 text-center">
          <p className="text-sm font-semibold text-gray-900">Ready to apply?</p>
          <a href={`/jobs/${g.relatedRole}/south-africa`}
            className="inline-block mt-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition">
            Browse {g.relatedRole} jobs
          </a>
        </div>
      )}
    </article>
  )
}
