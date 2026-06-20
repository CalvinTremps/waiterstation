import { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase-server'
import { MOCK_JOBS } from '@/lib/mock-jobs'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://waiterstation.co.za'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/companies`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/community`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/how-it-works`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/employers`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/faq`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/post-job`, changeFrequency: 'monthly', priority: 0.7 },
  ]

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

  return [...staticRoutes, ...jobRoutes]
}
