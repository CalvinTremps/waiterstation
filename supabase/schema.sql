-- Waiterstation V1 schema

create type role_category as enum (
  'waiter', 'chef', 'kitchen', 'housekeeping', 'front_desk',
  'bartender', 'barista', 'host', 'manager', 'other'
);

create type employment_type as enum ('permanent', 'seasonal', 'event');

create type job_status as enum ('pending', 'approved', 'expired');

create table jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  role_category role_category not null,
  location text not null,
  employment_type employment_type not null,
  pay text,
  description text not null,
  employer_name text not null,
  contact_method text not null,
  status job_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- Public read for approved jobs only
create policy "Public can view approved jobs"
  on jobs for select
  using (status = 'approved');

-- Anyone can insert (post a job)
create policy "Anyone can post a job"
  on jobs for insert
  with check (true);

alter table jobs enable row level security;

-- Index for filtering
create index jobs_status_created_at on jobs(status, created_at desc);
create index jobs_role_category on jobs(role_category);
create index jobs_location on jobs(location);

-- Workers table (stubbed for V1)
create table workers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_category role_category not null,
  location text not null,
  experience_summary text,
  availability text,
  phone text not null,
  certifications text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────
-- Company profiles, reviews, community posts & replies
-- ─────────────────────────────────────────────────────────────────

-- Company profiles
CREATE TABLE companies (
  id text PRIMARY KEY,
  name text NOT NULL,
  industry text,
  size text,
  location text,
  description text,
  overall_rating numeric(2,1),
  ratings jsonb,
  benefits text[],
  created_at timestamptz DEFAULT now()
);

-- Company reviews
CREATE TABLE company_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id text REFERENCES companies(id),
  author_id uuid REFERENCES auth.users(id),
  role text NOT NULL,
  employment_status text CHECK (employment_status IN ('Current', 'Former')),
  rating integer CHECK (rating BETWEEN 1 AND 5),
  pros text,
  cons text,
  anonymous boolean DEFAULT true,
  salary text,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Community posts
CREATE TABLE community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES auth.users(id),
  bowl text NOT NULL,
  content text NOT NULL,
  anonymous boolean DEFAULT false,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Community replies
CREATE TABLE community_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id),
  content text NOT NULL,
  anonymous boolean DEFAULT false,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Job applications (submitted via the on-site apply form)
CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id text NOT NULL,
  job_title text NOT NULL,
  employer_name text NOT NULL,
  applicant_name text NOT NULL,
  applicant_phone text NOT NULL,
  message text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);
