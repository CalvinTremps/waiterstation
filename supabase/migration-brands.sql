-- Brands & Franchises schema
-- Run this once in Supabase SQL editor

-- ─── BRANDS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS brands (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  industry    TEXT NOT NULL DEFAULT '',
  size        TEXT NOT NULL DEFAULT '',
  location    TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  website     TEXT,
  logo_url    TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── FRANCHISES ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS franchises (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id      UUID REFERENCES brands(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  contact_name  TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  location      TEXT NOT NULL DEFAULT '',
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── ADD BRAND/FRANCHISE COLUMNS TO JOBS ─────────────────────────────────────
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS brand_id     UUID REFERENCES brands(id) ON DELETE SET NULL;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS franchise_id UUID REFERENCES franchises(id) ON DELETE SET NULL;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source       TEXT DEFAULT 'employer';

-- ─── INDEXES ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_brands_name      ON brands (name);
CREATE INDEX IF NOT EXISTS idx_franchises_brand ON franchises (brand_id);
CREATE INDEX IF NOT EXISTS idx_jobs_brand       ON jobs (brand_id);
CREATE INDEX IF NOT EXISTS idx_jobs_franchise   ON jobs (franchise_id);

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS brands_updated_at ON brands;
CREATE TRIGGER brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS franchises_updated_at ON franchises;
CREATE TRIGGER franchises_updated_at BEFORE UPDATE ON franchises FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE brands     ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "brands_public_read"       ON brands;
DROP POLICY IF EXISTS "brands_service_write"     ON brands;
DROP POLICY IF EXISTS "franchises_public_read"   ON franchises;
DROP POLICY IF EXISTS "franchises_service_write" ON franchises;

CREATE POLICY "brands_public_read"       ON brands     FOR SELECT USING (true);
CREATE POLICY "brands_service_write"     ON brands     FOR ALL    USING (auth.role() = 'service_role');
CREATE POLICY "franchises_public_read"   ON franchises FOR SELECT USING (true);
CREATE POLICY "franchises_service_write" ON franchises FOR ALL    USING (auth.role() = 'service_role');

-- ─── SEED ────────────────────────────────────────────────────────────────────
INSERT INTO brands (name, industry, size, location, description, website, logo_url) VALUES
  ('Spur Corporation',         'Restaurant Group',  '1 000+ employees',  'Cape Town (HQ) · Nationwide',    'Spur Corporation operates Spur Steak Ranches, Panarottis, John Dory''s, RocoMamas and The Hussar Grill across South Africa and beyond.', 'spur.co.za',          'https://logo.clearbit.com/spur.co.za'),
  ('Nando''s South Africa',    'Restaurant Chain',  '1 000+ employees',  'Johannesburg (HQ) · Nationwide', 'South African-born global restaurant brand famous for PERi-PERi flame-grilled chicken, with 300+ locations in South Africa.',            'nandos.co.za',        'https://logo.clearbit.com/nandos.co.za'),
  ('Woolworths Food',          'Restaurant Group',  '1 000+ employees',  'Cape Town (HQ) · Nationwide',    'Woolworths Food cafes and in-store dining offer premium hospitality roles with above-average pay and structured development.',           'woolworths.co.za',    'https://logo.clearbit.com/woolworths.co.za'),
  ('Vida e Caffè',             'Cafe / Coffee',     '201–500 employees', 'Cape Town (HQ) · Nationwide',    'South Africa''s leading specialty coffee brand, known for a strong culture and above-average barista pay.',                            'vidaecaffe.com',      'https://logo.clearbit.com/vidaecaffe.com'),
  ('The Pot Luck Club',        'Restaurant Group',  '51–200 employees',  'Cape Town · Johannesburg',       'Luke Dale-Roberts'' group including The Test Kitchen, La Colombe, and The Pot Luck Club — fine dining flagship employers.',            null,                  null),
  ('Sun International',        'Hotel Group',       '1 000+ employees',  'Johannesburg (HQ) · Nationwide', 'JSE-listed hospitality group operating hotels, resorts and casinos across southern Africa.',                                          'suninternational.com','https://logo.clearbit.com/suninternational.com'),
  ('Tsogo Sun Hotels',         'Hotel Group',       '1 000+ employees',  'Johannesburg (HQ) · Nationwide', 'One of Africa''s largest hotel groups with 100+ properties including Southern Sun, Garden Court and StayEasy brands.',               'tsogosunhotels.com',  'https://logo.clearbit.com/tsogosunhotels.com'),
  ('Protea Hotels by Marriott','Hotel Group',       '1 000+ employees',  'Cape Town (HQ) · Nationwide',    'South Africa''s largest hotel brand, part of the Marriott International group, offering global career pathways.',                     'marriott.com',        'https://logo.clearbit.com/marriott.com'),
  ('Steers',                   'Fast Food',         '1 000+ employees',  'Johannesburg (HQ) · Nationwide', 'South Africa''s leading grill-burger fast food chain under Famous Brands, with 500+ locations nationwide.',                           'steers.co.za',        'https://logo.clearbit.com/steers.co.za'),
  ('Mugg & Bean',              'Restaurant Chain',  '500–1 000 employees','Johannesburg (HQ) · Nationwide','Famous Brands'' all-day dining chain known for large portions, muffins and a relaxed family atmosphere.',                             'muggandbean.co.za',   'https://logo.clearbit.com/muggandbean.co.za')
ON CONFLICT (name) DO NOTHING;
