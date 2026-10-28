-- Run in your own Supabase SQL editor, then set an edit key separately.
create extension if not exists pgcrypto with schema extensions;
create table if not exists public.trip_sections (
 section text primary key check(section in ('days','todos','budget')),
 payload jsonb not null,
 updated_at timestamptz not null default now()
);
create table if not exists public.trip_edit_secret (
 id int primary key check(id=1), key_hash text not null
);
alter table public.trip_sections enable row level security;
alter table public.trip_edit_secret enable row level security;
revoke all on public.trip_sections, public.trip_edit_secret from anon, authenticated;

create or replace function public.read_trip() returns jsonb
language sql security definer set search_path = '' as $$
 select jsonb_build_object(
  'sections',coalesce((select jsonb_object_agg(section,payload) from public.trip_sections),'{}'::jsonb),
  'changes',coalesce((select jsonb_agg(x) from (select '旅行伙伴' as "updatedBy",updated_at as "updatedAt" from public.trip_sections order by updated_at desc limit 1) x),'[]'::jsonb)
 );
$$;
create or replace function public.save_trip(p_key text,p_section text,p_payload jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare stored_hash text;
begin
 select key_hash into stored_hash from public.trip_edit_secret where id=1;
 if stored_hash is null or p_key is null or length(p_key)>256 or extensions.crypt(p_key,stored_hash)<>stored_hash then
   raise exception '编辑口令错误';
 end if;
 if p_section not in ('days','todos','budget') or jsonb_typeof(p_payload)<>'array' or octet_length(p_payload::text)>500000 then
   raise exception '无效的数据';
 end if;
 insert into public.trip_sections(section,payload) values(p_section,p_payload)
 on conflict(section) do update set payload=excluded.payload,updated_at=now();
 return jsonb_build_object('ok',true);
end;
$$;
revoke all on function public.read_trip() from public;
revoke all on function public.save_trip(text,text,jsonb) from public;
grant execute on function public.read_trip() to anon, authenticated;
grant execute on function public.save_trip(text,text,jsonb) to anon, authenticated;
-- Set the secret using a separate private query, never commit the real key:
-- insert into public.trip_edit_secret values(1,extensions.crypt('YOUR_RANDOM_EDIT_KEY',extensions.gen_salt('bf')))
-- on conflict(id) do update set key_hash=excluded.key_hash;
