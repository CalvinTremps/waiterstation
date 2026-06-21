-- Run this in the Supabase SQL editor

-- Extend applications table with fields needed for read-back and notifications
ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS employer_id        TEXT,
  ADD COLUMN IF NOT EXISTS worker_user_id     TEXT,
  ADD COLUMN IF NOT EXISTS applicant_email    TEXT,
  ADD COLUMN IF NOT EXISTS status             TEXT DEFAULT 'new'
    CHECK (status IN ('new','viewed','shortlisted','interview','offered','hired','rejected','withdrawn')),
  ADD COLUMN IF NOT EXISTS created_at         TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_applications_employer_id    ON applications (employer_id);
CREATE INDEX IF NOT EXISTS idx_applications_worker_user_id ON applications (worker_user_id);

-- Extend jobs table: store employer contact email at post time
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS employer_email TEXT;

-- Franchise columns (if not already added from migration-franchise.sql)
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS parent_company_id  TEXT,
  ADD COLUMN IF NOT EXISTS franchise_name     TEXT,
  ADD COLUMN IF NOT EXISTS franchise_email    TEXT,
  ADD COLUMN IF NOT EXISTS brand_link_status  TEXT
    CHECK (brand_link_status IN ('pending', 'approved', 'rejected'));

CREATE INDEX IF NOT EXISTS idx_jobs_parent_company
  ON jobs (parent_company_id, brand_link_status)
  WHERE parent_company_id IS NOT NULL;
