-- Run this in the Supabase SQL editor.
-- Persistence layer for the Community feature: posts, replies, likes,
-- reports, and crowd-sourced salary submissions.
--
-- The app reads these tables through createServerClient() and falls back to
-- mock data (MOCK_COMMUNITY_POSTS / MOCK_SALARIES) when the tables are empty
-- or unreachable — the same pattern used by the jobs feed. Applying this
-- migration switches the community from mock-only to real, shared data.

-- ── Posts ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_posts (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bowl               TEXT NOT NULL,
  content            TEXT NOT NULL,
  author_user_id     TEXT,                       -- null = anonymous
  author_name        TEXT,                       -- shown only when not anonymous
  author_role        TEXT,                       -- e.g. "Senior Waiter · Cape Town"
  author_avatar_letter TEXT DEFAULT 'A',
  is_anonymous       BOOLEAN NOT NULL DEFAULT TRUE,
  company_id         TEXT,                       -- optional link to a company page
  likes              INTEGER NOT NULL DEFAULT 0,
  comments_count     INTEGER NOT NULL DEFAULT 0,
  shares             INTEGER NOT NULL DEFAULT 0,
  status             TEXT NOT NULL DEFAULT 'visible'
                       CHECK (status IN ('visible','hidden','removed')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_posts_bowl    ON community_posts (bowl, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON community_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_company ON community_posts (company_id) WHERE company_id IS NOT NULL;
-- Engagement ordering for "Most discussed"
CREATE INDEX IF NOT EXISTS idx_community_posts_engagement
  ON community_posts ((likes + comments_count * 2) DESC)
  WHERE status = 'visible';

-- ── Replies ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_replies (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id            UUID NOT NULL REFERENCES community_posts (id) ON DELETE CASCADE,
  content            TEXT NOT NULL,
  author_user_id     TEXT,
  author_role        TEXT,
  author_avatar_letter TEXT DEFAULT 'A',
  is_anonymous       BOOLEAN NOT NULL DEFAULT TRUE,
  likes              INTEGER NOT NULL DEFAULT 0,
  status             TEXT NOT NULL DEFAULT 'visible'
                       CHECK (status IN ('visible','hidden','removed')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_replies_post ON community_replies (post_id, created_at);

-- ── Likes (one row per user per target; prevents double-counting) ─────
CREATE TABLE IF NOT EXISTS community_likes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT NOT NULL,
  target_type   TEXT NOT NULL CHECK (target_type IN ('post','reply')),
  target_id     UUID NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, target_type, target_id)
);

-- ── Reports (trust & safety; surfaced in the /admin moderation queue) ─
CREATE TABLE IF NOT EXISTS community_reports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type   TEXT NOT NULL CHECK (target_type IN ('post','reply')),
  target_id     UUID NOT NULL,
  reporter_user_id TEXT,
  reason        TEXT,
  status        TEXT NOT NULL DEFAULT 'open'
                  CHECK (status IN ('open','reviewed','dismissed')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_reports_open ON community_reports (status, created_at DESC);

-- ── Salary submissions (powers the Salary & Tips Explorer) ───────────
CREATE TABLE IF NOT EXISTS community_salaries (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role              TEXT NOT NULL,        -- RoleCategory value, e.g. 'waiter'
  city              TEXT NOT NULL,
  base_monthly      INTEGER NOT NULL CHECK (base_monthly >= 0),
  tips_monthly      INTEGER NOT NULL DEFAULT 0 CHECK (tips_monthly >= 0),
  experience_years  INTEGER NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
  venue_type        TEXT,
  submitted_user_id TEXT,                 -- null = anonymous
  status            TEXT NOT NULL DEFAULT 'visible'
                      CHECK (status IN ('visible','hidden')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_salaries_role_city ON community_salaries (role, city);

-- ── Row Level Security ───────────────────────────────────────────────
-- Public can read visible content; inserts are allowed for everyone
-- (anonymous posting is a product requirement); updates/deletes are
-- restricted to the service role (moderation runs server-side).
ALTER TABLE community_posts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_replies   ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reports   ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_salaries  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read visible posts"    ON community_posts    FOR SELECT USING (status = 'visible');
CREATE POLICY "insert posts"          ON community_posts    FOR INSERT WITH CHECK (true);
CREATE POLICY "read visible replies"  ON community_replies  FOR SELECT USING (status = 'visible');
CREATE POLICY "insert replies"        ON community_replies  FOR INSERT WITH CHECK (true);
CREATE POLICY "manage own likes"      ON community_likes    FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "insert reports"        ON community_reports  FOR INSERT WITH CHECK (true);
CREATE POLICY "read visible salaries" ON community_salaries FOR SELECT USING (status = 'visible');
CREATE POLICY "insert salaries"       ON community_salaries FOR INSERT WITH CHECK (true);
