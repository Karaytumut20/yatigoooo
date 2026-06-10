-- Yat bazlı biniş ve iniş noktaları
-- Supabase SQL Editor üzerinden bir kez çalıştırın.

alter table public.yachts
  add column if not exists pickup_points jsonb not null default '[]'::jsonb,
  add column if not exists dropoff_points jsonb not null default '[]'::jsonb;

alter table public.bookings
  add column if not exists pickup_point text,
  add column if not exists dropoff_point text,
  add column if not exists pickup_fee integer not null default 0,
  add column if not exists dropoff_fee integer not null default 0;

comment on column public.yachts.pickup_points is
  'Biniş seçenekleri: [{"name":"Bebek İskelesi","price":0}]';

comment on column public.yachts.dropoff_points is
  'İniş seçenekleri: [{"name":"Kuruçeşme İskelesi","price":1500}]';
