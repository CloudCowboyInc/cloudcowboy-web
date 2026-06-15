-- Lets the (unauthenticated) login page check if an email is approved BEFORE
-- sending a magic link, so non-members get routed to Request Access instead.
create or replace function public.email_is_allowed(p_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.allowlist where email = lower(p_email));
$$;

grant execute on function public.email_is_allowed(text) to anon, authenticated;
