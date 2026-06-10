-- Migration: Remove deprecated yacht fields
-- Date: 2026-06-08
-- Description: Removes dining_capacity, speed, cabins, bathrooms, and crew fields from yachts table
-- These fields are no longer used in the application

-- IMPORTANT: Backup your data before running this migration!
-- You can rollback if needed using the rollback script at the end

-- Step 1: Drop columns from yachts table
ALTER TABLE yachts 
  DROP COLUMN IF EXISTS dining_capacity,
  DROP COLUMN IF EXISTS speed,
  DROP COLUMN IF EXISTS cabins,
  DROP COLUMN IF EXISTS bathrooms,
  DROP COLUMN IF EXISTS crew;

-- Step 2: Update seo column to remove deprecated visible_specs fields
-- This updates the JSONB structure to only keep length, capacity, and hourly_price
UPDATE yachts 
SET seo = jsonb_set(
  COALESCE(seo, '{}'::jsonb),
  '{display_options,visible_specs}',
  jsonb_build_object(
    'length', COALESCE(seo->'display_options'->'visible_specs'->>'length', 'true')::boolean,
    'capacity', COALESCE(seo->'display_options'->'visible_specs'->>'capacity', 'true')::boolean,
    'hourly_price', COALESCE(seo->'display_options'->'visible_specs'->>'hourly_price', 'true')::boolean
  )
)
WHERE seo IS NOT NULL 
  AND seo->'display_options'->'visible_specs' IS NOT NULL;

-- Verify the changes
SELECT 
  slug,
  name,
  capacity,
  length,
  hourly_price,
  seo->'display_options'->'visible_specs' as visible_specs
FROM yachts
LIMIT 5;

-- ============================================
-- ROLLBACK SCRIPT (if you need to undo this)
-- ============================================
-- UNCOMMENT AND RUN IF YOU NEED TO ROLLBACK:
/*
ALTER TABLE yachts 
  ADD COLUMN IF NOT EXISTS dining_capacity integer DEFAULT 10,
  ADD COLUMN IF NOT EXISTS speed text DEFAULT '15kts',
  ADD COLUMN IF NOT EXISTS cabins integer DEFAULT 2,
  ADD COLUMN IF NOT EXISTS bathrooms integer DEFAULT 2,
  ADD COLUMN IF NOT EXISTS crew integer DEFAULT 2;

-- Restore default values
UPDATE yachts 
SET 
  dining_capacity = capacity,
  speed = '15kts',
  cabins = 2,
  bathrooms = 2,
  crew = 2
WHERE dining_capacity IS NULL;
*/
