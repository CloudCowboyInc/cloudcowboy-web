-- Cloud Cowboy — Investor engagement schema
-- Per-user saved model config, activity/time tracking, section feedback, and
-- export snapshots. Run via `supabase db push` or the SQL editor.
-- Relies on public.is_admin() from 0001_init.sql.

-- ============================================================
-- Tables
-- ============================================================

-- One current configuration per investor (auto-saved as they work).
create table if not exists public.investor_configs (
  email      text primary key,
  config     jsonb not null,
  updated_at timestamptz not null default now()
);

-- Section engagement events (time spent, visits, exports, etc.).
create table if not exists public.investor_activity (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  section     text not null,
  kind        text not null default 'time' check (kind in ('time','visit','export','comment')),
  seconds     integer not null default 0,
  occurred_at timestamptz not null default now()
);
create index if not exists investor_activity_email_idx on public.investor_activity (email);

-- Section feedback / notes from investors, with an optional admin reply.
create table if not exists public.investor_comments (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  section    text not null,
  body       text not null,
  created_at timestamptz not null default now(),
  reply      text,
  replied_by text,
  replied_at timestamptz
);
create index if not exists investor_comments_email_idx on public.investor_comments (email);

-- Snapshot of each Excel export (so Chris can reference the exact numbers).
create table if not exists public.investor_exports (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  config     jsonb not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row-level security
-- ============================================================
alter table public.investor_configs  enable row level security;
alter table public.investor_activity enable row level security;
alter table public.investor_comments enable row level security;
alter table public.investor_exports  enable row level security;

-- Helper: the caller's lowercased email.
-- (auth.jwt() ->> 'email')

-- configs: a user reads/writes only their own row; admins read all.
drop policy if exists cfg_self on public.investor_configs;
create policy cfg_self on public.investor_configs
  for all using (email = lower(auth.jwt() ->> 'email') or public.is_admin())
  with check (email = lower(auth.jwt() ->> 'email'));

-- activity: a user inserts only their own; admins read all.
drop policy if exists act_insert_self on public.investor_activity;
create policy act_insert_self on public.investor_activity
  for insert with check (email = lower(auth.jwt() ->> 'email'));
drop policy if exists act_admin_read on public.investor_activity;
create policy act_admin_read on public.investor_activity
  for select using (public.is_admin());

-- comments: a user inserts + reads their own; admins read all + reply (update).
drop policy if exists cmt_insert_self on public.investor_comments;
create policy cmt_insert_self on public.investor_comments
  for insert with check (email = lower(auth.jwt() ->> 'email'));
drop policy if exists cmt_read on public.investor_comments;
create policy cmt_read on public.investor_comments
  for select using (email = lower(auth.jwt() ->> 'email') or public.is_admin());
drop policy if exists cmt_admin_update on public.investor_comments;
create policy cmt_admin_update on public.investor_comments
  for update using (public.is_admin()) with check (public.is_admin());

-- exports: a user inserts their own; admins read all.
drop policy if exists exp_insert_self on public.investor_exports;
create policy exp_insert_self on public.investor_exports
  for insert with check (email = lower(auth.jwt() ->> 'email'));
drop policy if exists exp_admin_read on public.investor_exports;
create policy exp_admin_read on public.investor_exports
  for select using (public.is_admin());

-- ============================================================
-- Privileges (RLS still applies)
-- ============================================================
grant select, insert, update on public.investor_configs  to authenticated;
grant select, insert          on public.investor_activity to authenticated;
grant select, insert, update  on public.investor_comments to authenticated;
grant select, insert          on public.investor_exports  to authenticated;
