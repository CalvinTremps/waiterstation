-- Run this in the Supabase SQL editor.
-- Per-admin accounts with hashed passwords + optional TOTP 2FA.
-- All access is via the service role (the admin API); RLS is enabled with no
-- public policies so anon/public clients can never read or write this table.

CREATE TABLE IF NOT EXISTS admin_users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT UNIQUE NOT NULL,
  name           TEXT,
  password_hash  TEXT NOT NULL,            -- scrypt$salt$key
  totp_secret    TEXT,                     -- base32; null until 2FA set up
  totp_enabled   BOOLEAN NOT NULL DEFAULT FALSE,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at  TIMESTAMPTZ
);

-- Heal an older partial table if it predates these columns.
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS totp_secret   TEXT,
  ADD COLUMN IF NOT EXISTS totp_enabled  BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- Lock down: enabled with NO policies => only the service role can touch it.
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Bootstrapping the first admin:
-- Easiest is to log in once with the ADMIN_PASSWORD break-glass (set in env),
-- then use Admin -> Admins to create real accounts. Or insert one directly,
-- but the password must be a scrypt hash from the app, so the break-glass path
-- is recommended.
