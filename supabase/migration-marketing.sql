-- Run this in the Supabase SQL editor.
-- CMS storage for editable marketing-page content. Public pages read these
-- records via getMarketingPage() and fall back to MARKETING_PAGES (mock) when
-- the table is empty/unreachable. The /admin Marketing section upserts here.

CREATE TABLE IF NOT EXISTS marketing_pages (
  slug             TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  path             TEXT NOT NULL,
  seo_title        TEXT NOT NULL DEFAULT '',
  seo_description  TEXT NOT NULL DEFAULT '',
  hero_heading     TEXT NOT NULL DEFAULT '',
  hero_subheading  TEXT NOT NULL DEFAULT '',
  body             TEXT NOT NULL DEFAULT '',
  published        BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Public can read published pages; writes happen server-side via the service
-- role (admin API), so no public insert/update policy is granted.
ALTER TABLE marketing_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read published marketing pages"
  ON marketing_pages FOR SELECT
  USING (published = TRUE);

-- Seed the initial rows so editing starts from the current live copy.
-- (Safe to re-run; ON CONFLICT keeps existing edits.)
INSERT INTO marketing_pages (slug, name, path, seo_title, seo_description, hero_heading, hero_subheading) VALUES
  ('home',         'Home / Landing', '/',            'Waiterstation | Hospitality Jobs in South Africa', 'Find waiter, chef, kitchen, and hotel jobs across South Africa. Apply in seconds — no CV required.', 'Thousands of Hospitality Jobs in South Africa', 'Waiter, chef, bartender, barista, kitchen and hotel roles — find your next job and apply in seconds.'),
  ('about',        'About',          '/about',       'About | Waiterstation', 'Waiterstation is a job board for hospitality workers in South Africa.', 'About Waiterstation', 'South Africa''s dedicated job board for hospitality workers.'),
  ('how-it-works', 'How It Works',   '/how-it-works','How It Works | Waiterstation', 'How Waiterstation works for hospitality workers and employers in South Africa.', 'How Waiterstation works', 'South Africa''s hospitality job board. No CVs, no portals, no friction.'),
  ('faq',          'FAQ',            '/faq',         'FAQ | Waiterstation', 'Frequently asked questions about Waiterstation.', 'Frequently asked questions', 'Everything you need to know about finding and posting hospitality jobs.'),
  ('employers',    'For Employers',  '/employers',   'For Employers | Waiterstation', 'Post hospitality jobs and find staff fast across South Africa.', 'Hire hospitality staff, fast', 'Post a job in under two minutes and reach thousands of hospitality workers.')
ON CONFLICT (slug) DO NOTHING;
