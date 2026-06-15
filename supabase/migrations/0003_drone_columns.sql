-- Cloud Cowboy — add drone/source/services/social columns to leads.
-- Run in the Supabase SQL editor.

alter table public.leads
  add column if not exists source        text,
  add column if not exists operator_type text,
  add column if not exists services      text[] default '{}',
  add column if not exists facebook      text,
  add column if not exists instagram     text;

-- Backfill existing (CDA Colorado) rows.
update public.leads set
  source = coalesce(source, 'CDA-CO'),
  operator_type = coalesce(operator_type,
    case
      when upper(coalesce(name,'')) like '%DRONE%'
        or upper(coalesce(name,'')) like '%UAV%'
        or upper(coalesce(dba,''))  like '%DRONE%' then 'drone'
      when aerial then 'aerial'
      else 'ground'
    end)
where source is null or operator_type is null;
