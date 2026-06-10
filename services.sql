-- Dinamik rezervasyon hizmetleri
-- Supabase SQL Editor'de bir kez çalıştırın. Tekrar çalıştırılması güvenlidir.

create extension if not exists pgcrypto;

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  price integer not null default 0 check (price >= 0),
  price_type text not null default 'fixed' check (price_type in ('fixed', 'per_person')),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table services add column if not exists description text default '';
alter table services add column if not exists price integer not null default 0;
alter table services add column if not exists price_type text not null default 'fixed';
alter table services add column if not exists is_active boolean not null default true;
alter table services add column if not exists sort_order integer not null default 0;
alter table services add column if not exists updated_at timestamptz not null default now();

alter table bookings add column if not exists extras jsonb not null default '[]'::jsonb;

alter table services enable row level security;
drop policy if exists "public read active services" on services;
create policy "public read active services"
  on services for select
  using (is_active = true);

-- Başlangıç hizmetleri. İstemiyorsanız bu insert bölümünü çalıştırmayabilirsiniz.
insert into services (name, description, price, price_type, sort_order)
select 'Gurme Yemek Menüsü', 'Kişi başı zengin set menü servisi', 40, 'per_person', 10
where not exists (select 1 from services where name = 'Gurme Yemek Menüsü');

insert into services (name, description, price, price_type, sort_order)
select 'Profesyonel Keman Dinletisi', 'Seyir süresince canlı keman resitali', 150, 'fixed', 20
where not exists (select 1 from services where name = 'Profesyonel Keman Dinletisi');

insert into services (name, description, price, price_type, sort_order)
select 'Köprüye Lazerle İsim Yazma', 'Boğaziçi köprüsü altına yüksek güç lazer şovu', 300, 'fixed', 30
where not exists (select 1 from services where name = 'Köprüye Lazerle İsim Yazma');
