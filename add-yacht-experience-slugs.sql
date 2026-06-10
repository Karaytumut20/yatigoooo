-- Add experience_slugs column to yachts table
ALTER TABLE public.yachts ADD COLUMN IF NOT EXISTS experience_slugs text[] DEFAULT '{}'::text[];

-- Insert "Saatlik Yat Turu" experience if not exists (using jsonb for array columns)
INSERT INTO public.experiences (slug, title, category, short_description, description, starting_price, duration, image, suitable_for, includes)
VALUES (
  'saatlik-yat-turu', 
  'Saatlik Yat Turu', 
  'transfer', 
  'Minimum 2 saat kiralama imkanıyla İstanbul Boğazı''nda saatlik kiralama keyfi.', 
  'Dilediğiniz gün ve saatte, minimum 2 saat kiralama şartıyla kendi özel Boğaz gezinizi kendiniz planlayın.', 
  3000, 
  '2 Saat', 
  'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200', 
  '["Herkes"]'::jsonb, 
  '["Kaptan ve Mürettebat", "Yakıt & Liman Masrafları", "Müzik Sistemi Bağlantısı"]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
