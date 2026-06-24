import { createServerClient } from './supabase-server'
import { withTimeout } from './with-timeout'

/**
 * Editable marketing-page content (CMS).
 *
 * Public marketing pages read their SEO + hero copy through getMarketingPage()
 * and fall back to MARKETING_PAGES when the `marketing_pages` table is empty or
 * unreachable — the same mock-first pattern used across the app. The /admin
 * Marketing section edits these records; applying migration-marketing.sql makes
 * those edits persist and show on the live pages.
 */
export interface MarketingPage {
  slug: string
  name: string          // label shown in admin
  path: string          // public URL
  seo_title: string
  seo_description: string
  hero_heading: string
  hero_subheading: string
  body: string          // optional long-form body (plain text / simple markdown)
  published: boolean
  updated_at: string
}

export const MARKETING_PAGES: MarketingPage[] = [
  {
    slug: 'home',
    name: 'Home / Landing',
    path: '/',
    seo_title: 'Waiterstation | Hospitality Jobs in South Africa',
    seo_description: 'Find waiter, chef, kitchen, and hotel jobs across South Africa. Apply in seconds — no CV required.',
    hero_heading: 'Thousands of Hospitality Jobs in South Africa',
    hero_subheading: 'Waiter, chef, bartender, barista, kitchen and hotel roles — find your next job and apply in seconds.',
    body: '',
    published: true,
    updated_at: '2026-06-23T09:00:00+02:00',
  },
  {
    slug: 'about',
    name: 'About',
    path: '/about',
    seo_title: 'About | Waiterstation',
    seo_description: 'Waiterstation is a job board for hospitality workers in South Africa.',
    hero_heading: 'About Waiterstation',
    hero_subheading: 'South Africa’s dedicated job board for hospitality workers — built to make finding work fast, fair, and CV-free.',
    body: 'Waiterstation connects waiters, chefs, bartenders, baristas and hotel staff with employers across South Africa. We believe applying for a job should take seconds, not hours.',
    published: true,
    updated_at: '2026-06-23T09:00:00+02:00',
  },
  {
    slug: 'how-it-works',
    name: 'How It Works',
    path: '/how-it-works',
    seo_title: 'How It Works | Waiterstation',
    seo_description: 'How Waiterstation works for hospitality workers and employers in South Africa.',
    hero_heading: 'How Waiterstation works',
    hero_subheading: 'South Africa’s hospitality job board. No CVs, no portals, no friction.',
    body: '',
    published: true,
    updated_at: '2026-06-23T09:00:00+02:00',
  },
  {
    slug: 'faq',
    name: 'FAQ',
    path: '/faq',
    seo_title: 'FAQ | Waiterstation',
    seo_description: 'Frequently asked questions about Waiterstation for hospitality workers and employers in South Africa.',
    hero_heading: 'Frequently asked questions',
    hero_subheading: 'Everything you need to know about finding and posting hospitality jobs on Waiterstation.',
    body: '',
    published: true,
    updated_at: '2026-06-23T09:00:00+02:00',
  },
  {
    slug: 'employers',
    name: 'For Employers',
    path: '/employers',
    seo_title: 'For Employers | Waiterstation',
    seo_description: 'Post hospitality jobs and find staff fast across South Africa. Reach waiters, chefs, bartenders and more.',
    hero_heading: 'Hire hospitality staff, fast',
    hero_subheading: 'Post a job in under two minutes and reach thousands of hospitality workers across South Africa.',
    body: '',
    published: true,
    updated_at: '2026-06-23T09:00:00+02:00',
  },
]

const BY_SLUG = new Map(MARKETING_PAGES.map(p => [p.slug, p]))

/** All marketing pages — Supabase first, mock fallback. Used by the admin list. */
export async function getAllMarketingPages(): Promise<MarketingPage[]> {
  try {
    const supabase = await createServerClient()
    const res = await withTimeout(
      supabase.from('marketing_pages').select('*').order('name'),
      3000
    )
    if (res?.data && res.data.length > 0) {
      // Merge: DB overrides mock; keep any mock-only pages not yet in DB
      const dbBySlug = new Map((res.data as MarketingPage[]).map(p => [p.slug, p]))
      return MARKETING_PAGES.map(p => dbBySlug.get(p.slug) ?? p)
    }
  } catch {}
  return MARKETING_PAGES
}

/** A single marketing page by slug — Supabase first, mock fallback. */
export async function getMarketingPage(slug: string): Promise<MarketingPage | null> {
  try {
    const supabase = await createServerClient()
    const res = await withTimeout(
      supabase.from('marketing_pages').select('*').eq('slug', slug).single(),
      3000
    )
    if (res?.data) return res.data as MarketingPage
  } catch {}
  return BY_SLUG.get(slug) ?? null
}
