-- Waiterstation V2 schema additions
-- Run this after schema.sql

-- Add employer linkage to jobs
alter table jobs add column if not exists employer_id uuid references auth.users(id);

-- Employer profiles
create table if not exists employer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  business_name text,
  contact_name text,
  phone text,
  website text,
  created_at timestamptz not null default now()
);

alter table employer_profiles enable row level security;

create policy "Employers can read own profile"
  on employer_profiles for select using (auth.uid() = id);

create policy "Employers can insert own profile"
  on employer_profiles for insert with check (auth.uid() = id);

create policy "Employers can update own profile"
  on employer_profiles for update using (auth.uid() = id);

-- Worker profiles
create table if not exists worker_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role_category role_category,
  location text,
  experience_summary text,
  availability text,
  phone text,
  certifications text,
  created_at timestamptz not null default now()
);

alter table worker_profiles enable row level security;

create policy "Workers can read own profile"
  on worker_profiles for select using (auth.uid() = id);

create policy "Workers can insert own profile"
  on worker_profiles for insert with check (auth.uid() = id);

create policy "Workers can update own profile"
  on worker_profiles for update using (auth.uid() = id);

-- Employers can update/delete their own jobs
create policy "Employers can update own jobs"
  on jobs for update using (auth.uid() = employer_id);

create policy "Employers can delete own jobs"
  on jobs for delete using (auth.uid() = employer_id);

-- Employers can see all their own jobs (including pending/expired)
create policy "Employers can view own jobs"
  on jobs for select using (auth.uid() = employer_id);
