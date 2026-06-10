-- 1. Create Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  phone text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Trigger to Automatically Create Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Modify Bookings Table to Support Auth & Timeslots
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS start_time text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extras jsonb;

-- Enable Row Level Security on Bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Bookings Policies
-- Users can only view their own bookings (by ID or matching email)
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id OR email = auth.jwt()->>'email');

-- Users can insert their own bookings (or anonymous/guest bookings if allowed)
DROP POLICY IF EXISTS "Users can insert their own bookings" ON public.bookings;
CREATE POLICY "Users can insert their own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow admins to see all bookings
DROP POLICY IF EXISTS "Admins can view and manage all bookings" ON public.bookings;
CREATE POLICY "Admins can view and manage all bookings" ON public.bookings
  FOR ALL USING (
    (auth.jwt()->>'email' LIKE '%admin%') OR 
    (auth.jwt()->'user_metadata'->>'role' = 'admin')
  );

-- 4. Create Function to Fetch Occupied Slots Safely
CREATE OR REPLACE FUNCTION public.get_occupied_slots(p_yacht_slug text, p_booking_date date)
RETURNS TABLE (start_time text, duration integer)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT b.start_time, b.duration
  FROM public.bookings b
  WHERE b.yacht_slug = p_yacht_slug
    AND b.booking_date = p_booking_date
    AND b.status <> 'İptal';
END;
$$;
