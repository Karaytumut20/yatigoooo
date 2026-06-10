-- Yachts Table
CREATE TABLE IF NOT EXISTS yachts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  short_description text,
  description text,
  length text,
  capacity integer,
  dining_capacity integer,
  speed text,
  cabins integer,
  bathrooms integer,
  crew integer,
  hourly_price integer,
  full_day_price integer,
  min_hours integer,
  images text[],
  amenities text[],
  features text[],
  packages jsonb,
  seo jsonb,
  yacht_type text,
  cabin_count integer,
  has_pool boolean DEFAULT false,
  has_flybridge boolean DEFAULT false,
  extra_guest_pricing jsonb DEFAULT '[]'::jsonb,
  pickup_points jsonb DEFAULT '[]'::jsonb,
  dropoff_points jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Kolonları sonradan ekleme (zaten tablo varsa eksik kolonları tamamlar)
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS extra_guest_pricing jsonb DEFAULT '[]'::jsonb;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS pickup_points jsonb DEFAULT '[]'::jsonb;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS dropoff_points jsonb DEFAULT '[]'::jsonb;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS short_description text;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS length text;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS capacity integer;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS dining_capacity integer;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS speed text;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS cabins integer;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS bathrooms integer;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS crew integer;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS hourly_price integer;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS full_day_price integer;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS min_hours integer;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS images text[];
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS amenities text[];
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS features text[];
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS packages jsonb;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS seo jsonb;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS yacht_type text;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS cabin_count integer;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS has_pool boolean DEFAULT false;
ALTER TABLE yachts ADD COLUMN IF NOT EXISTS has_flybridge boolean DEFAULT false;

-- Experiences Table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  short_description text,
  description text,
  category text,
  duration text,
  starting_price integer,
  image text,
  images text[],
  features text[],
  suitable_for text[] DEFAULT '{}',
  includes text[] DEFAULT '{}',
  recommended_yachts text[] DEFAULT '{}',
  sample_flow text[] DEFAULT '{}',
  faq jsonb DEFAULT '[]'::jsonb,
  seo jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE experiences ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS image text;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS suitable_for text[] DEFAULT '{}';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS includes text[] DEFAULT '{}';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS recommended_yachts text[] DEFAULT '{}';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS sample_flow text[] DEFAULT '{}';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS faq jsonb DEFAULT '[]'::jsonb;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS seo jsonb DEFAULT '{}'::jsonb;


-- Blog Posts Table
CREATE TABLE blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text,
  category text,
  image text,
  read_time text,
  author text,
  seo jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bookings Table
CREATE TABLE bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  email text,
  phone text,
  yacht_slug text,
  experience_slug text,
  booking_date date,
  duration integer,
  guests integer,
  total_amount integer,
  status text DEFAULT 'Bekliyor',
  notes text,
  pickup_point text,
  dropoff_point text,
  pickup_fee integer DEFAULT 0,
  dropoff_fee integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Settings Table
CREATE TABLE settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name text NOT NULL,
  contact_email text,
  contact_phone text,
  whatsapp_number text,
  instagram_url text,
  facebook_url text,
  address text,
  seo jsonb,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Initial Settings
INSERT INTO settings (site_name, contact_email, contact_phone, whatsapp_number, instagram_url, address)
VALUES (
  'yatigotr',
  'info@bosphorusyacht.com',
  '+90 555 666 77 88',
  '905556667788',
  'https://instagram.com/bosphorusyacht',
  'Bebek, İstanbul'
);
