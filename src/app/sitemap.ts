import { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase-server'
import { MOCK_JOBS } from '@/lib/mock-jobs'
import { allSeoJobParams } from '@/lib/seo-pages'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://waiterstation.co.za'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/jobs`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/companies`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/community`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/how-it-works`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/employers`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/faq`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/post-job`, changeFrequency: 'monthly', priority: 0.7 },
  ]

  // Programmatic role × city landing pages (SEO)
  const seoRoutes: MetadataRoute.Sitemap = allSeoJobParams().map(({ role, city }) => ({
    url: `${base}/jobs/${role}/${city}`,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  let jobIds: string[] = MOCK_JOBS.map(j => j.id)
  try {
    const supabase = await createServerClient()
    const { data } = await supabase
      .from('jobs')
      .select('id, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(500)
    if (data) jobIds = data.map((j: { id: string }) => j.id)
  } catch {}

  const jobRoutes: MetadataRoute.Sitemap = jobIds.map(id => ({
    url: `${base}/jobs/${id}`,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  return [...staticRoutes, ...seoRoutes, ...jobRoutes]
}
