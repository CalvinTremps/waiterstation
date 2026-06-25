-- Link employer profiles to brands + extend for review moderation
-- Run after schema-v2.sql and migration-brands-v2.sql

-- Employer can claim a brand
ALTER TABLE employer_profiles ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id) ON DELETE SET NULL;
ALTER TABLE employer_profiles ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE employer_profiles ADD COLUMN IF NOT EXISTS company_description TEXT;
ALTER TABLE employer_profiles ADD COLUMN IF NOT EXISTS company_logo_url TEXT;
ALTER TABLE employer_profiles ADD COLUMN IF NOT EXISTS company_location TEXT;
ALTER TABLE employer_profiles ADD COLUMN IF NOT EXISTS company_website TEXT;
ALTER TABLE employer_profiles ADD COLUMN IF NOT EXISTS company_industry TEXT;
ALTER TABLE employer_profiles ADD COLUMN IF NOT EXISTS company_size TEXT;

-- Allow workers (auth users) to also insert brand_reviews
-- (policy already created in migration-brands-v2.sql)

-- Index for employer -> brand lookup
CREATE INDEX IF NOT EXISTS idx_employer_profiles_brand ON employer_profiles (brand_id);
