-- Franchise / brand linking columns on jobs table
-- Run this in the Supabase SQL editor

ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS parent_company_id   TEXT,
  ADD COLUMN IF NOT EXISTS franchise_name      TEXT,
  ADD COLUMN IF NOT EXISTS franchise_email     TEXT,
  ADD COLUMN IF NOT EXISTS brand_link_status   TEXT
    CHECK (brand_link_status IN ('pending', 'approved', 'rejected'));

-- Index for fast company-page queries
CREATE INDEX IF NOT EXISTS idx_jobs_parent_company
  ON jobs (parent_company_id, brand_link_status)
  WHERE parent_company_id IS NOT NULL;
