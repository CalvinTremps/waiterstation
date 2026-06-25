-- Brands v2: add ratings, benefits, claimed; add brand_reviews table
-- Run in Supabase SQL editor after migration-brands.sql

-- ─── Extend brands table ──────────────────────────────────────────────────────
ALTER TABLE brands ADD COLUMN IF NOT EXISTS overall_rating  NUMERIC(2,1) DEFAULT NULL;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS ratings         JSONB        DEFAULT NULL;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS benefits        TEXT[]       DEFAULT '{}';
ALTER TABLE brands ADD COLUMN IF NOT EXISTS claimed         BOOLEAN      NOT NULL DEFAULT false;

-- ─── Brand reviews table ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS brand_reviews (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id          UUID        NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  author_id         UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  role              TEXT        NOT NULL DEFAULT '',
  employment_status TEXT        NOT NULL DEFAULT 'Former' CHECK (employment_status IN ('Current', 'Former')),
  rating            INTEGER     NOT NULL CHECK (rating BETWEEN 1 AND 5),
  pros              TEXT        NOT NULL DEFAULT '',
  cons              TEXT        NOT NULL DEFAULT '',
  anonymous         BOOLEAN     NOT NULL DEFAULT true,
  author_name       TEXT,
  salary            TEXT,
  helpful_count     INTEGER     NOT NULL DEFAULT 0,
  status            TEXT        NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_brand_reviews_brand   ON brand_reviews (brand_id);
CREATE INDEX IF NOT EXISTS idx_brand_reviews_status  ON brand_reviews (status);

DROP TRIGGER IF EXISTS brand_reviews_updated_at ON brand_reviews;
CREATE TRIGGER brand_reviews_updated_at
  BEFORE UPDATE ON brand_reviews
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE brand_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "brand_reviews_public_read"   ON brand_reviews;
DROP POLICY IF EXISTS "brand_reviews_auth_insert"   ON brand_reviews;
DROP POLICY IF EXISTS "brand_reviews_service_write" ON brand_reviews;

CREATE POLICY "brand_reviews_public_read"
  ON brand_reviews FOR SELECT USING (status = 'approved');

CREATE POLICY "brand_reviews_auth_insert"
  ON brand_reviews FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "brand_reviews_service_write"
  ON brand_reviews FOR ALL
  USING (auth.role() = 'service_role');
