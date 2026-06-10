-- Admin modules: experiences, blog, bookings and settings
-- Run once in Supabase SQL Editor. Safe to run again.

create extension if not exists pgcrypto;

create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, title text not null, category text,
  short_description text, description text, starting_price integer default 0,
  duration text, image text, suitable_for text[] default '{}', includes text[] default '{}',
  sample_flow text[] default '{}', recommended_yachts text[] default '{}',
  faq jsonb default '[]'::jsonb, seo jsonb default '{}'::jsonb,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
alter table experiences add column if not exists description text;
alter table experiences add column if not exists image text;
alter table experiences add column if not exists suitable_for text[] default '{}';
alter table experiences add column if not exists includes text[] default '{}';
alter table experiences add column if not exists recommended_yachts text[] default '{}';
alter table experiences add column if not exists sample_flow text[] default '{}';
alter table experiences add column if not exists faq jsonb default '[]'::jsonb;
alter table experiences add column if not exists seo jsonb default '{}'::jsonb;
alter table experiences add column if not exists updated_at timestamptz default now();

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, title text not null, excerpt text, content text,
  category text, image text, read_time text, author text,
  published_at timestamptz default now(), seo jsonb default '{}'::jsonb,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
alter table blog_posts add column if not exists published_at timestamptz default now();
alter table blog_posts add column if not exists excerpt text;
alter table blog_posts add column if not exists content text;
alter table blog_posts add column if not exists category text;
alter table blog_posts add column if not exists image text;
alter table blog_posts add column if not exists read_time text;
alter table blog_posts add column if not exists author text;
alter table blog_posts add column if not exists seo jsonb default '{}'::jsonb;
alter table blog_posts add column if not exists updated_at timestamptz default now();

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(), customer_name text not null,
  email text, phone text, yacht_slug text, experience_slug text, booking_date date,
  duration integer, guests integer, total_amount integer, status text default 'Bekliyor',
  notes text, created_at timestamptz default now(), updated_at timestamptz default now()
);
alter table bookings add column if not exists updated_at timestamptz default now();
alter table bookings add column if not exists email text;
alter table bookings add column if not exists phone text;
alter table bookings add column if not exists yacht_slug text;
alter table bookings add column if not exists experience_slug text;
alter table bookings add column if not exists booking_date date;
alter table bookings add column if not exists duration integer;
alter table bookings add column if not exists guests integer;
alter table bookings add column if not exists total_amount integer;
alter table bookings add column if not exists status text default 'Bekliyor';
alter table bookings add column if not exists notes text;

create table if not exists settings (
  id uuid primary key default gen_random_uuid(), site_title text, site_description text,
  contact_email text, contact_phone text, whatsapp_number text, instagram_url text,
  facebook_url text, youtube_url text, address text, prepayment_percentage integer default 50,
  seo jsonb default '{}'::jsonb, updated_at timestamptz default now()
);
alter table settings add column if not exists youtube_url text;
alter table settings add column if not exists prepayment_percentage integer default 50;
alter table settings add column if not exists site_title text;
alter table settings add column if not exists site_description text;
alter table settings add column if not exists contact_email text;
alter table settings add column if not exists contact_phone text;
alter table settings add column if not exists whatsapp_number text;
alter table settings add column if not exists instagram_url text;
alter table settings add column if not exists facebook_url text;
alter table settings add column if not exists address text;
alter table settings add column if not exists seo jsonb default '{}'::jsonb;

-- Public website can read published content/settings and create booking requests.
alter table experiences enable row level security;
alter table blog_posts enable row level security;
alter table bookings enable row level security;
alter table settings enable row level security;
drop policy if exists "public read experiences" on experiences;
create policy "public read experiences" on experiences for select using (true);
drop policy if exists "public read blog" on blog_posts;
create policy "public read blog" on blog_posts for select using (true);
drop policy if exists "public create bookings" on bookings;
create policy "public create bookings" on bookings for insert with check (true);
drop policy if exists "public read settings" on settings;
create policy "public read settings" on settings for select using (true);
