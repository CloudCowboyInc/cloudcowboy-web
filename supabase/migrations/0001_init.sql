-- Cloud Cowboy — Phase 2 schema (Supabase / Postgres)
-- Run this in your Supabase project's SQL editor (or via `supabase db push`).

-- ============================================================
-- Tables
-- ============================================================

-- Approved users. Membership = approved. role drives admin vs investor.
create table if not exists public.allowlist (
  email       text primary key,
  role        text not null default 'investor' check (role in ('admin','investor')),
  approved_by text,
  created_at  timestamptz not null default now()
);

-- Inbound "request access" submissions (investor portal).
create table if not exists public.access_requests (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  name         text,
  org          text,
  note         text,
  status       text not null default 'pending' check (status in ('pending','approved','denied')),
  requested_at timestamptz not null default now()
);

-- CRM leads (team-only). Mirrors src/data/leads.ts.
create table if not exists public.leads (
  id         text primary key,
  name       text,
  dba        text,
  contact    text,
  aerial     boolean default false,
  codes      text[] default '{}',
  phone      text,
  email      text,
  website    text,
  city       text,
  county     text,
  state      text,
  zip        text,
  lat        double precision,
  lng        double precision,
  employees  text,
  revenue    text,
  status     text not null default 'New',
  readiness  text,
  updated_at timestamptz not null default now()
);

-- CRM interaction log (team-only).
create table if not exists public.interactions (
  id         uuid primary key default gen_random_uuid(),
  lead_id    text not null references public.leads(id) on delete cascade,
  type       text not null check (type in ('call','email','meeting','note')),
  summary    text not null,
  author     text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Helper: is the current user an admin?
-- security definer so it can read allowlist regardless of RLS.
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.allowlist
    where email = lower(auth.jwt() ->> 'email') and role = 'admin'
  );
$$;

create or replace function public.is_allowed()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.allowlist
    where email = lower(auth.jwt() ->> 'email')
  );
$$;

-- ============================================================
-- Row-level security
-- ============================================================
alter table public.allowlist       enable row level security;
alter table public.access_requests enable row level security;
alter table public.leads           enable row level security;
alter table public.interactions    enable row level security;

-- allowlist: a user may read their OWN row (so the app can detect their role);
-- admins may read/write everything.
drop policy if exists allowlist_read_self on public.allowlist;
create policy allowlist_read_self on public.allowlist
  for select using (email = lower(auth.jwt() ->> 'email') or public.is_admin());
drop policy if exists allowlist_admin_write on public.allowlist;
create policy allowlist_admin_write on public.allowlist
  for all using (public.is_admin()) with check (public.is_admin());

-- access_requests: ANYONE may submit a request; only admins may read/manage.
drop policy if exists req_insert_any on public.access_requests;
create policy req_insert_any on public.access_requests
  for insert with check (true);
drop policy if exists req_admin_read on public.access_requests;
create policy req_admin_read on public.access_requests
  for select using (public.is_admin());
drop policy if exists req_admin_update on public.access_requests;
create policy req_admin_update on public.access_requests
  for update using (public.is_admin()) with check (public.is_admin());

-- leads + interactions: team-only (admins).
drop policy if exists leads_admin_all on public.leads;
create policy leads_admin_all on public.leads
  for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists inter_admin_all on public.interactions;
create policy inter_admin_all on public.interactions
  for all using (public.is_admin()) with check (public.is_admin());

-- Privileges (RLS still applies on top of these).
grant insert on public.access_requests to anon, authenticated;
grant select on public.allowlist to authenticated;
grant select, insert, update on public.access_requests to authenticated;
grant select, insert, update, delete on public.leads to authenticated;
grant select, insert, update, delete on public.interactions to authenticated;
